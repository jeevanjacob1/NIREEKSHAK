# TrustUs (NIREEKSHAK) – AI‑Powered MPLADS Risk Intelligence Platform

---

## 📖 Project Overview
**NIREEKSHAK** (by **Team TrustUs**) is an **explainable public‑project risk intelligence platform** designed to support the monitoring of **MPLADS (Members of Parliament Local Area Development Scheme)** projects. The system identifies unusual patterns, cost deviations, duplicate works, timeline issues, and other risk signals, providing **evidence‑backed risk indicators** for auditors and administrators. It does **not declare fraud**; it surfaces actionable insights for human review.

---

## 🎯 Problem & Objectives
- **Fragmented project data** and **slow manual monitoring** hinder timely detection of irregularities.
- Lack of **transparent risk prioritization** makes auditing inefficient.
- **Objectives**:
  - Detect anomalies across MPLADS projects.
  - Prioritise high‑risk projects with an explainable risk score.
  - Supply evidence‑based insights to enable data‑driven administrative decisions.

---

## 📂 Data Sources
The prototype consumes **public government‑published MPLADS records**, including:
- Work‑level details (description, constituency, state).
- Expenditure amounts and status.
- Dates of project initiation/completion.
- Additional metadata (e.g., beneficiary details).

> **Note:** All data used are publicly available datasets referenced in the SIH 2026 problem statement (SIH26102).

---

## 🧭 Methodology
1. **Data Collection & Ingestion** – Pull raw MPLADS CSV/JSON feeds.
2. **Pre‑processing** – Clean, normalise, and enrich records.
3. **Anomaly Detection Engines** – Apply statistical checks, ML‑based unsupervised detectors, and rule‑based compliance checks.
4. **Risk Fusion** – Combine multiple signals (cost intelligence, duplicate/semantic similarity, execution timelines, utilisation behaviour) into a single explainable risk score.
5. **Explainability Layer** – Attach supporting evidence (e.g., comparable projects, cost benchmarks) to each flag.
6. **Human Review Queue** – Surface flagged projects on the dashboard for auditors.

---

## 🤖 AI/ML Approach
- **Unsupervised anomaly detection** (e.g., Isolation Forest, One‑Class SVM) to surface outliers without needing labeled fraud data.
- **Statistical cost‑intelligence** – Detect abnormal cost deviations.
- **Semantic similarity** – Leverage Sentence‑Transformers to find duplicate or near‑duplicate works.
- **Rule‑based compliance** – Encode policy‑driven checks (e.g., maximum permissible cost).
- **Explainable risk score** – Weighted fusion of signals with a transparent contribution breakdown.

---

## 🏗️ System Architecture
```
MPLADS Data → Ingestion / Pre‑processing → PostgreSQL DB
                       │
                       ▼
               Detection Engines (Python)
                       │
                       ▼
               Risk Fusion & Explainability
                       │
                       ▼
          Review Queue → FastAPI Backend → React/Next.js Dashboard
```
- Modular design enables swapping components (e.g., swapping the ML model) without affecting the rest of the pipeline.

---

## 🛠️ Technology Stack
| Layer | Technology |
|-------|------------|
| **Backend** | Python, FastAPI, Scikit‑learn, Pandas, NumPy, Sentence‑Transformers |
| **Database** | PostgreSQL |
| **Frontend** | React, Next.js, Tailwind CSS |
| **Containerisation** | Docker |
| **CI/CD** | Git, GitHub Actions |
| **Security** | JWT authentication, role‑based access control, audit logs |

---

## 📊 Dashboard & Usage
- **Search & filter** MPLADS projects by risk score, constituency, date range, etc.
- **Drill‑down view** shows detailed evidence for each flag (cost benchmark, duplicate work comparison, timeline deviation).
- **Prioritisation** – Sort projects by highest risk to focus auditor effort.
- **Export** flagged project lists for offline review.

---

## 🧾 Explainability & Human Review
Every flag includes:
- **Why it was raised** (e.g., “Cost 2.3× higher than district average”).
- **Supporting evidence** (similar historic projects, rule violations, statistical outlier metrics).
- **Recommended actions** (review, request clarification, schedule field inspection).
Human auditors make the final verification and decision.

---

## 🚀 Feasibility & Deployment
- **Software‑only solution** using publicly available data.
- Scalable from **batch analysis** to **near‑real‑time** monitoring.
- Designed for **national‑scale deployment** with containerised services and horizontal scaling.

---

## ⚠️ Challenges & Limitations
- No ground‑truth fraud labels → reliance on unsupervised methods may generate false positives.
- Legitimate cost variations can be mis‑flagged.
- Incomplete or inconsistent records can affect model reliability.
- Changing data schemas require ongoing data‑pipeline maintenance.

---

## 🌍 Impact
- Enhances **public accountability** and **fund utilisation** transparency.
- Enables **earlier detection** of unusual patterns, reducing audit latency.
- Provides **data‑driven insights** for policymakers and administrators.

---

## 📚 Research & References
- MPLADS policy documents and framework resources.
- Government‑published MPLADS datasets (work‑level records).
- CAG audit reports for reference evidence.
- SIH 2026 problem statement **SIH26102**.

---

## 📦 Installation & Running
> **⚠️** Replace placeholder values with the actual configuration used in the repository.

### Prerequisites
- **Docker** (recommended) or local Python & Node environments.
- **PostgreSQL** instance (any version ≥ 12).
- Environment variables (placeholders shown):
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`
  - `FASTAPI_HOST` (e.g., `0.0.0.0`)
  - `FASTAPI_PORT` (e.g., `8000`)
  - `NEXT_PUBLIC_API_URL` (FastAPI base URL for the frontend)
  - `JWT_SECRET_KEY`

### Backend (FastAPI)
```bash
# Clone the repo (if not already done)
git clone <repo‑url>
cd NIREEKSHAK-main/backend

# (Optional) Use Docker
docker compose up -d   # docker‑compose.yml should define fastapi and postgres services

# Or run locally
python -m venv venv
venv\Scripts\activate   # Windows activation
pip install -r requirements.txt
uvicorn app.main:app --host $FASTAPI_HOST --port $FASTAPI_PORT
```

### Frontend (Next.js)
```bash
cd ../frontend   # adjust path as per repo layout
npm install
npm run dev   # defaults to http://localhost:3000
```

### Accessing the Dashboard
Open your browser and navigate to `http://localhost:3000` (or the configured host) after both services are up.

---

## 📄 License
Specify the project license here (e.g., MIT, Apache 2.0). If not yet decided, add a `LICENSE` file later.

---
