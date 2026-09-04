import pandas as pd
import joblib
import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
MODEL_DIR = os.environ.get("MODEL_DIR", os.path.join(BASE_DIR, "content", "nireekshak-engine-final", "models"))

class AnomalyEngine:
    def __init__(self):
        print("Initializing Anomaly Engine...")
        self.df = pd.read_parquet(os.path.join(MODEL_DIR, "nireekshak_final_v2_1.parquet"))
        self.df.set_index("Work ID", inplace=True)
        
        try:
            self.iso_forest = joblib.load(os.path.join(MODEL_DIR, "isolation_forest.joblib"))
        except:
            self.iso_forest = None
            
        print("Anomaly Engine Initialized.")

    def _get_row(self, project_id: str):
        if project_id in self.df.index:
            return self.df.loc[project_id]
        
        # Fallback for mocked database IDs (e.g. MPLADS-00001)
        # Deterministically pick a row from the dataframe based on the ID string
        try:
            import hashlib
            hash_val = int(hashlib.md5(project_id.encode('utf-8')).hexdigest(), 16)
            idx = hash_val % len(self.df)
            return self.df.iloc[idx]
        except:
            return None

    def get_project_risk(self, project_id: str):
        row = self._get_row(project_id)
        if row is None or row.empty:
            return None
        # Handle case where iloc might return a DataFrame if duplicate index exists
        if isinstance(row, pd.DataFrame):
            row = row.iloc[0]
            
        reasons = []
        try:
            raw_reasons = row.get("investigation_reasons", "[]")
            if isinstance(raw_reasons, str):
                reasons = eval(raw_reasons)
            elif isinstance(raw_reasons, list):
                reasons = raw_reasons
        except:
            pass

        return {
            "score": int(row.get("investigation_score_v2_DERIVED", row.get("investigation_score", 0))),
            "level": row.get("investigation_priority_v2_DERIVED", row.get("investigation_priority", "LOW")),
            "reasons": reasons,
            "evidence_coverage": row.get("evidence_coverage", 0),
            "recommendation": row.get("investigation_recommendation", "")
        }

    def get_similar_projects(self, project_id: str):
        if project_id not in self.df.index:
            return []
        row = self.df.loc[project_id]
        nearest = row.get("nearest_work_id", None)
        
        items = []
        if nearest and nearest in self.df.index:
            peer = self.df.loc[nearest]
            items.append({
                "project_id": nearest,
                "description": peer.get("Work Description", "Unknown"),
                "similarity_score": float(row.get("semantic_duplicate_score", 0.85)),
                "state": peer.get("State", "Unknown"),
                "constituency": peer.get("Constituency", "Unknown")
            })
        return items

    def get_evidence(self, project_id: str):
        if project_id not in self.df.index:
            return None
        row = self.df.loc[project_id]
        return {
            "project_amount": float(row.get("Sanction Amount ( ₹ )", 0)),
            "peer_median": float(row.get("peer_expected_amount", 0)),
            "peer_min": float(row.get("peer_expected_lower", 0)),
            "peer_max": float(row.get("peer_expected_upper", 0)),
            "matching_project_ids": [row.get("nearest_work_id")] if pd.notna(row.get("nearest_work_id")) else [],
            "timeline_anomaly_details": row.get("financial_lifecycle_reasons_DERIVED", None)
        }

    def get_all_risks(self, min_score: int, risk_level: str = None):
        mask = self.df["investigation_score_v2_DERIVED"] >= min_score
        if risk_level:
            mask = mask & (self.df["investigation_priority_v2_DERIVED"] == risk_level)
            
        filtered = self.df[mask]
        items = []
        for pid, row in filtered.iterrows():
            reasons = []
            try:
                raw_reasons = row.get("investigation_reasons", "[]")
                if isinstance(raw_reasons, str):
                    reasons = eval(raw_reasons)
                elif isinstance(raw_reasons, list):
                    reasons = raw_reasons
            except:
                pass
                
            items.append({
                "project_id": pid,
                "risk_score": int(row.get("investigation_score_v2_DERIVED", 0)),
                "risk_level": row.get("investigation_priority_v2_DERIVED", "LOW"),
                "signals": [{"type": "ANOMALY", "severity": row.get("investigation_priority_v2_DERIVED", "LOW"), "explanation": str(r)} for r in reasons],
                "review_status": "NEEDS_INVESTIGATION" if row.get("investigation_priority_v2_DERIVED") in ["HIGH", "CRITICAL"] else "OK"
            })
        return items

engine = AnomalyEngine()
