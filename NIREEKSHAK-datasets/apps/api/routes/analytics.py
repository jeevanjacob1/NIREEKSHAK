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

    # 2. Count risk distribution from AnomalyEngine memory-efficiently
    series = engine.df["investigation_priority_v2_DERIVED"]
    high_risk = int((series == "HIGH").sum() + (series == "CRITICAL").sum())
    med_risk = int((series == "MEDIUM").sum())
    low_risk = int((series == "LOW").sum())
    
    # Use loc and sum to prevent copying entire dataframe rows
    flagged_amount = engine.df.loc[series.isin(["HIGH", "CRITICAL", "MEDIUM"]), "Sanction Amount ( ₹ )"].sum()

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