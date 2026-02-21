"""
Extract UNSW-NB15 compatible features from .pcap using scapy.
Output DataFrame column order matches training dataset; categoricals are encoded.
"""
from __future__ import annotations

import os
from collections import defaultdict
from typing import Optional

import numpy as np
import pandas as pd

# UNSW-NB15 feature column order (47 model input features; no label, no attack_cat)
FEATURE_COLUMNS = [
    "srcip",
    "sport",
    "dstip",
    "dsport",
    "proto",
    "state",
    "dur",
    "sbytes",
    "dbytes",
    "sttl",
    "dttl",
    "sloss",
    "dloss",
    "service",
    "Sload",
    "Dload",
    "Spkts",
    "Dpkts",
    "swin",
    "dwin",
    "stcpb",
    "dtcpb",
    "smeansz",
    "dmeansz",
    "trans_depth",
    "res_bdy_len",
    "Sjit",
    "Djit",
    "Stime",
    "Ltime",
    "Sintpkt",
    "Dintpkt",
    "tcprtt",
    "synack",
    "ackdat",
    "is_sm_ips_ports",
    "ct_state_ttl",
    "ct_flw_http_mthd",
    "is_ftp_login",
    "ct_ftp_cmd",
    "ct_srv_src",
    "ct_srv_dst",
    "ct_dst_ltm",
    "ct_src_ltm",
    "ct_src_dport_ltm",
    "ct_dst_sport_ltm",
    "ct_dst_src_ltm",
]

# Categorical columns that require encoding (must match training pipeline)
CATEGORICAL_COLUMNS = ["srcip", "dstip", "proto", "state", "service"]

# Proto and state label-encoding maps (align with common UNSW preprocessing)
PROTO_MAP = {"tcp": 0, "udp": 1, "icmp": 2, "other": 3}
STATE_MAP = {"FIN": 0, "INT": 1, "CON": 2, "REQ": 3, "RST": 4, "PAR": 5, "acc": 6, "other": 7}
SERVICE_MAP = {"http": 0, "ssh": 1, "dns": 2, "smtp": 3, "ftp": 4, "ftp-data": 5, "-": 6, "other": 7}


def _get_proto(pkt) -> str:
    try:
        if pkt.haslayer("TCP"):
            return "tcp"
        if pkt.haslayer("UDP"):
            return "udp"
        if pkt.haslayer("ICMP"):
            return "icmp"
    except Exception:
        pass
    return "other"


def _get_service(pkt, dport: int) -> str:
    try:
        if pkt.haslayer("TCP"):
            if dport == 80:
                return "http"
            if dport == 22:
                return "ssh"
            if dport == 25:
                return "smtp"
            if dport == 21:
                return "ftp"
            if dport == 20:
                return "ftp-data"
        if pkt.haslayer("UDP") and dport == 53:
            return "dns"
    except Exception:
        pass
    return "-"


def _get_state(pkt) -> str:
    try:
        if pkt.haslayer("TCP"):
            flags = pkt["TCP"].flags
            if flags == 0x02:
                return "REQ"
            if flags == 0x12:
                return "CON"
            if flags == 0x04:
                return "RST"
            if flags == 0x11:
                return "FIN"
    except Exception:
        pass
    return "other"


def _flow_key(pkt):
    try:
        ip = pkt.getlayer("IP")
        if ip is None:
            return None
        src = ip.src
        dst = ip.dst
        sport = 0
        dport = 0
        proto = _get_proto(pkt)
        if pkt.haslayer("TCP"):
            sport = pkt["TCP"].sport
            dport = pkt["TCP"].dport
        elif pkt.haslayer("UDP"):
            sport = pkt["UDP"].sport
            dport = pkt["UDP"].dport
        return (src, sport, dst, dport, proto)
    except Exception:
        return None


def extract_features(file_path: str) -> pd.DataFrame:
    """
    Read .pcap with scapy, aggregate into flows, compute UNSW-NB15-like features.
    Returns a single-row DataFrame with columns in FEATURE_COLUMNS order.
    Categorical columns are label-encoded.
    """
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"Pcap file not found: {file_path}")
    if not file_path.lower().endswith(".pcap") and not file_path.lower().endswith(".pcapng"):
        raise ValueError("File must be a .pcap or .pcapng")

    try:
        from scapy.all import rdpcap
    except ImportError:
        raise ImportError("scapy is required; install with: pip install scapy")

    packets = rdpcap(file_path)
    if not packets:
        return _empty_features_row()

    # Aggregate by flow (srcip, sport, dstip, dsport, proto)
    flows = defaultdict(lambda: {
        "srcip": None,
        "sport": 0,
        "dstip": None,
        "dsport": 0,
        "proto": "other",
        "state": "other",
        "service": "-",
        "times": [],
        "sbytes": 0,
        "dbytes": 0,
        "Spkts": 0,
        "Dpkts": 0,
        "sizes_fwd": [],
        "sizes_bwd": [],
        "ttl_fwd": [],
        "ttl_bwd": [],
        "tcp_win_fwd": [],
        "tcp_win_bwd": [],
        "tcp_seq_fwd": [],
        "tcp_seq_bwd": [],
        "inter_fwd": [],
        "inter_bwd": [],
    })

    for i, pkt in enumerate(packets):
        key = _flow_key(pkt)
        if key is None:
            continue
        src, sport, dst, dport, proto = key
        rev_key = (dst, dport, src, sport, proto)

        try:
            ip = pkt.getlayer("IP")
            if ip is None:
                continue
            payload_len = len(ip.payload) if ip.payload else 0
            total_len = len(pkt)
            ttl = ip.ttl if hasattr(ip, "ttl") else 0
            t_sec = float(pkt.time) if hasattr(pkt, "time") else 0.0

            if key in flows:
                f = flows[key]
                f["sbytes"] += total_len
                f["Spkts"] += 1
                f["sizes_fwd"].append(total_len)
                f["ttl_fwd"].append(ttl)
                if len(f["times"]) > 0:
                    f["inter_fwd"].append(t_sec - f["times"][-1])
                f["times"].append(t_sec)
                if pkt.haslayer("TCP"):
                    f["tcp_win_fwd"].append(pkt["TCP"].window)
                    f["tcp_seq_fwd"].append(pkt["TCP"].seq)
            else:
                flows[key] = {
                    "srcip": src,
                    "sport": sport,
                    "dstip": dst,
                    "dsport": dport,
                    "proto": proto,
                    "state": _get_state(pkt),
                    "service": _get_service(pkt, dport),
                    "times": [t_sec],
                    "sbytes": total_len,
                    "dbytes": 0,
                    "Spkts": 1,
                    "Dpkts": 0,
                    "sizes_fwd": [total_len],
                    "sizes_bwd": [],
                    "ttl_fwd": [ttl],
                    "ttl_bwd": [],
                    "tcp_win_fwd": [pkt["TCP"].window] if pkt.haslayer("TCP") else [],
                    "tcp_win_bwd": [],
                    "tcp_seq_fwd": [pkt["TCP"].seq] if pkt.haslayer("TCP") else [],
                    "tcp_seq_bwd": [],
                    "inter_fwd": [],
                    "inter_bwd": [],
                }

            # Update reverse flow (backward direction)
            if rev_key not in flows:
                flows[rev_key] = {
                    "srcip": dst,
                    "sport": dport,
                    "dstip": src,
                    "dsport": sport,
                    "proto": proto,
                    "state": "other",
                    "service": "-",
                    "times": [],
                    "sbytes": 0,
                    "dbytes": 0,
                    "Spkts": 0,
                    "Dpkts": 0,
                    "sizes_fwd": [],
                    "sizes_bwd": [],
                    "ttl_fwd": [],
                    "ttl_bwd": [],
                    "tcp_win_fwd": [],
                    "tcp_win_bwd": [],
                    "tcp_seq_fwd": [],
                    "tcp_seq_bwd": [],
                    "inter_fwd": [],
                    "inter_bwd": [],
                }
            f = flows[rev_key]
            f["dbytes"] += total_len
            f["Dpkts"] += 1
            f["sizes_bwd"].append(total_len)
            f["ttl_bwd"].append(ttl)
            if len(f["times"]) > 0:
                f["inter_bwd"].append(t_sec - f["times"][-1])
            f["times"].append(t_sec)
            if pkt.haslayer("TCP"):
                f["tcp_win_bwd"].append(pkt["TCP"].window)
                f["tcp_seq_bwd"].append(pkt["TCP"].seq)
        except Exception:
            continue

    # Build one row per flow, then aggregate to a single row (mean/max/sum) for prediction
    rows = []
    for k, f in flows.items():
        times = f["times"]
        dur = (max(times) - min(times)) if len(times) > 1 else 0.0
        sttl = max(f["ttl_fwd"]) if f["ttl_fwd"] else 0
        dttl = max(f["ttl_bwd"]) if f["ttl_bwd"] else 0
        sloss = 0
        dloss = 0
        Sload = (f["sbytes"] / dur) if dur > 0 else 0
        Dload = (f["dbytes"] / dur) if dur > 0 else 0
        swin = max(f["tcp_win_fwd"]) if f["tcp_win_fwd"] else 0
        dwin = max(f["tcp_win_bwd"]) if f["tcp_win_bwd"] else 0
        stcpb = int(f["tcp_seq_fwd"][0]) if f["tcp_seq_fwd"] else 0
        dtcpb = int(f["tcp_seq_bwd"][0]) if f["tcp_seq_bwd"] else 0
        smeansz = np.mean(f["sizes_fwd"]) if f["sizes_fwd"] else 0
        dmeansz = np.mean(f["sizes_bwd"]) if f["sizes_bwd"] else 0
        trans_depth = 0
        res_bdy_len = 0
        Sintpkt = np.mean(f["inter_fwd"]) if f["inter_fwd"] else 0
        Dintpkt = np.mean(f["inter_bwd"]) if f["inter_bwd"] else 0
        Sjit = np.std(f["inter_fwd"]) if len(f["inter_fwd"]) > 1 else 0
        Djit = np.std(f["inter_bwd"]) if len(f["inter_bwd"]) > 1 else 0
        Stime = min(times) if times else 0
        Ltime = max(times) if times else 0
        tcprtt = 0
        synack = 0
        ackdat = 0
        is_sm_ips_ports = 1 if (f["srcip"] == f["dstip"] or f["sport"] == f["dsport"]) else 0
        ct_state_ttl = 0
        ct_flw_http_mthd = 0
        is_ftp_login = 1 if f["service"] == "ftp" else 0
        ct_ftp_cmd = 0
        ct_srv_src = 1
        ct_srv_dst = 1
        ct_dst_ltm = 0
        ct_src_ltm = 0
        ct_src_dport_ltm = 0
        ct_dst_sport_ltm = 0
        ct_dst_src_ltm = 1

        rows.append({
            "srcip": f["srcip"],
            "sport": f["sport"],
            "dstip": f["dstip"],
            "dsport": f["dsport"],
            "proto": f["proto"],
            "state": f["state"],
            "service": f["service"],
            "dur": dur,
            "sbytes": f["sbytes"],
            "dbytes": f["dbytes"],
            "sttl": sttl,
            "dttl": dttl,
            "sloss": sloss,
            "dloss": dloss,
            "Sload": Sload,
            "Dload": Dload,
            "Spkts": f["Spkts"],
            "Dpkts": f["Dpkts"],
            "swin": swin,
            "dwin": dwin,
            "stcpb": stcpb,
            "dtcpb": dtcpb,
            "smeansz": smeansz,
            "dmeansz": dmeansz,
            "trans_depth": trans_depth,
            "res_bdy_len": res_bdy_len,
            "Sjit": Sjit,
            "Djit": Djit,
            "Stime": Stime,
            "Ltime": Ltime,
            "Sintpkt": Sintpkt,
            "Dintpkt": Dintpkt,
            "tcprtt": tcprtt,
            "synack": synack,
            "ackdat": ackdat,
            "is_sm_ips_ports": is_sm_ips_ports,
            "ct_state_ttl": ct_state_ttl,
            "ct_flw_http_mthd": ct_flw_http_mthd,
            "is_ftp_login": is_ftp_login,
            "ct_ftp_cmd": ct_ftp_cmd,
            "ct_srv_src": ct_srv_src,
            "ct_srv_dst": ct_srv_dst,
            "ct_dst_ltm": ct_dst_ltm,
            "ct_src_ltm": ct_src_ltm,
            "ct_src_dport_ltm": ct_src_dport_ltm,
            "ct_dst_sport_ltm": ct_dst_sport_ltm,
            "ct_dst_src_ltm": ct_dst_src_ltm,
        })

    if not rows:
        return _empty_features_row()

    df = pd.DataFrame(rows)

    # Encode categoricals: use hashed integer for IPs to keep numeric
    df["srcip"] = df["srcip"].astype(str).apply(lambda x: hash(x) % (2**31))
    df["dstip"] = df["dstip"].astype(str).apply(lambda x: hash(x) % (2**31))
    df["proto"] = df["proto"].map(lambda x: PROTO_MAP.get(x, PROTO_MAP["other"]))
    df["state"] = df["state"].map(lambda x: STATE_MAP.get(x, STATE_MAP["other"]))
    df["service"] = df["service"].map(lambda x: SERVICE_MAP.get(x, SERVICE_MAP["other"]))

    # Aggregate flows into one row (mean) for single prediction
    out = df[FEATURE_COLUMNS].mean(axis=0).to_frame().T
    out = out.reindex(columns=FEATURE_COLUMNS, fill_value=0)
    return out.astype(np.float64)


def _empty_features_row() -> pd.DataFrame:
    """Return a single row of zeros in FEATURE_COLUMNS order."""
    row = {c: 0.0 for c in FEATURE_COLUMNS}
    return pd.DataFrame([row])[FEATURE_COLUMNS]
