"""
Flask ML service: /api/predict.
Accepts file_path (pcap) or complaint payload; returns prediction and backward-compatible mlResult.
"""
import os
import pickle
from pathlib import Path

from flask import Flask, request, jsonify

from feature_extractor import extract_features, FEATURE_COLUMNS

app = Flask(__name__)

MODEL_DIR = Path(__file__).resolve().parent / "model"
BINARY_MODEL_PATH = MODEL_DIR / "xgb_binary_model.pkl"
_model = None


def load_model():
    global _model
    if _model is not None:
        return _model
    if not BINARY_MODEL_PATH.is_file():
        raise FileNotFoundError(f"Model not found: {BINARY_MODEL_PATH}")
    with open(BINARY_MODEL_PATH, "rb") as f:
        _model = pickle.load(f)
    return _model


def prediction_to_ml_result(prediction: int) -> dict:
    """Map binary prediction to API contract: is_threat, category, confidence."""
    is_threat = bool(prediction)
    category = "pcap_analysis"
    confidence = 0.9 if is_threat else 0.85
    return {
        "prediction": int(prediction),
        "is_threat": is_threat,
        "isThreat": is_threat,
        "category": category,
        "confidence": confidence,
    }


@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        body = request.get_json(silent=True) or {}
        file_path = body.get("file_path") or (request.form.get("file_path") if request.form else None)

        if file_path:
            return _predict_from_pcap(file_path)

        # Existing contract: complaint_type, description, subject, device_info
        return _predict_from_complaint(body)
    except FileNotFoundError as e:
        return jsonify({"error": str(e), "message": "File not found"}), 404
    except ValueError as e:
        return jsonify({"error": str(e), "message": "Bad request"}), 400
    except Exception as e:
        return jsonify({"error": str(e), "message": "Prediction failed"}), 500


def _predict_from_pcap(file_path: str):
    if not file_path or not isinstance(file_path, str):
        raise ValueError("file_path is required and must be a string")
    path = file_path.strip()
    if not os.path.isabs(path):
        base = os.environ.get("PCAP_BASE_PATH", os.getcwd())
        path = os.path.normpath(os.path.join(base, path))
    if not os.path.isfile(path):
        raise FileNotFoundError(f"Pcap file not found: {path}")

    df = extract_features(path)
    model = load_model()

    # Ensure column order matches training (feature_extractor already returns FEATURE_COLUMNS)
    if hasattr(model, "feature_names_in_"):
        cols = [c for c in model.feature_names_in_ if c in df.columns]
        if cols:
            df = df.reindex(columns=cols, fill_value=0)
    else:
        df = df.reindex(columns=FEATURE_COLUMNS, fill_value=0)

    pred = model.predict(df)
    prediction = int(pred[0]) if hasattr(pred, "__getitem__") else int(pred)

    result = prediction_to_ml_result(prediction)
    return jsonify(result)


def _predict_from_complaint(body: dict):
    """Fallback when no file_path: preserve existing API contract (e.g. rule-based)."""
    threat_types = [
        "Hacking / Unauthorized Access",
        "Ransomware",
        "Data Breach",
        "Identity Theft",
    ]
    complaint_type = body.get("complaint_type") or body.get("complaintType") or ""
    is_threat = complaint_type in threat_types
    prediction = 1 if is_threat else 0
    result = {
        "prediction": prediction,
        "is_threat": is_threat,
        "isThreat": is_threat,
        "category": complaint_type or "unknown",
        "confidence": 0.85,
    }
    return jsonify(result)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=False)
