from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Project
from schemas import AnalyticsOverview
from services.engine import engine

router = APIRouter(prefix="/analytics", tags=["Analytics & KPIs"])

@router.get("/overview", response_model=AnalyticsOverview)
def get_analytics_overview(db: Session = Depends(get_db)):
    """Calculates live dashboard KPIs directly from PostgreSQL."""
    
    # 1. Total projects in the database
    total_projects = db.query(func.count(Project.project_id)).scalar() or 0

    # 2. Count risk distribution from AnomalyEngine
    high_risk = len(engine.df[engine.df["investigation_priority_v2_DERIVED"] == "HIGH"]) + len(engine.df[engine.df["investigation_priority_v2_DERIVED"] == "CRITICAL"])
    med_risk = len(engine.df[engine.df["investigation_priority_v2_DERIVED"] == "MEDIUM"])
    low_risk = len(engine.df[engine.df["investigation_priority_v2_DERIVED"] == "LOW"])
    
    flagged_amount = engine.df[engine.df["investigation_priority_v2_DERIVED"].isin(["HIGH", "CRITICAL", "MEDIUM"])]["Sanction Amount ( ₹ )"].sum()

    # 4. Map SQL results exactly to expected JSON format
    return {
        "total_projects": total_projects,
        "high_risk_projects": high_risk,
        "medium_risk_projects": med_risk,
        "under_review_projects": high_risk, # Assuming all HIGH risk are under review for now
        "flagged_amount": float(flagged_amount),
        "risk_distribution": {
            "HIGH": high_risk,
            "MEDIUM": med_risk,
            "LOW": low_risk
        }
    }