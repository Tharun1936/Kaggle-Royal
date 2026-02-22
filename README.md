🛡 Decentralized Cybersecurity Monitoring System

A decentralized endpoint security monitoring system that runs independently on each device.
The application collects system information, analyzes potential threats locally, triggers antivirus actions if necessary, and securely reports incidents to a central server.

📖 Description

This project implements a lightweight security agent that operates directly on individual devices without relying on centralized detection services.

Each device:

Collects its own system data

Analyzes suspicious behavior locally

Automatically responds to threats

Sends detailed threat reports to a central server

The detection process works offline and does not depend on external APIs.

✨ Features

Independent local monitoring

Rule-based threat detection (optional ML integration)

Automatic antivirus triggering

Encrypted local data storage

Secure REST API communication

Cross-platform support (Windows & Linux)

🏗 System Architecture
Local Device Agent
 ├── Data Collection
 ├── Threat Detection (Rule-Based / ML)
 ├── Antivirus Trigger
 ├── Report Generation
 └── Secure Report Submission

                ↓

        Central Server (REST API)
                ↓
        Report Storage & Logging
🔍 Detection Workflow
1. Data Collection

The agent collects:

IP addresses

Open ports

Running processes

Network activity

Suspicious behavior patterns

2. Local Analysis

The system analyzes collected data using:

Rule-based detection logic

(Optional) Machine Learning model

3. Response

If no threat is detected:

System Secure
No issues detected

If a threat is detected:

Trigger installed antivirus via command-line

Quarantine or remove malicious process

Generate detailed threat report

Send report securely to server

🗂 Project Structure
decentralized-cyber-monitor/
│
├── agent/
│   ├── collector/
│   ├── detection/
│   ├── response/
│   ├── storage/
│   └── main.py
│
├── server/
│   ├── api.py
│   └── database.py
│
├── config/
├── requirements.txt
└── README.md
🛠 Tech Stack

Language: Python
Monitoring: psutil, socket
Encryption: cryptography
API Framework: FastAPI
HTTP Client: requests

Python is recommended for better system-level access and easier ML integration.

🚀 Installation
Clone the Repository
git clone https://github.com/yourusername/decentralized-cyber-monitor.git
cd decentralized-cyber-monitor
Install Dependencies
pip install -r requirements.txt
Run the Local Agent
python agent/main.py
Run the Central Server
uvicorn server.api:app --host 0.0.0.0 --port 8000
🔐 Security Measures

Encrypted local storage

HTTPS communication

Token-based authentication

Offline threat detection capability

📄 Example Threat Report
{
  "timestamp": "2026-02-22T14:35:00",
  "device_id": "DEVICE-001",
  "threat_type": "Suspicious Process",
  "affected_processes": ["malware.exe"],
  "network_anomalies": ["Unusual outbound traffic"],
  "action_taken": "Process quarantined via antivirus"
}
📌 Future Improvements

ML-based anomaly detection

Real-time monitoring dashboard

Docker containerization

Centralized analytics panel

Automatic rule updates
