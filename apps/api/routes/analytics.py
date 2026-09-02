from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Project, ProjectRisk
from schemas import AnalyticsOverview

router = APIRouter(prefix="/analytics", tags=["Analytics & KPIs"])

@router.get("/overview", response_model=AnalyticsOverview)
def get_analytics_overview(db: Session = Depends(get_db)):
    """Calculates live dashboard KPIs directly from PostgreSQL."""
    
    # 1. Total projects in the database
    total_projects = db.query(func.count(Project.project_id)).scalar() or 0

    # 2. Count risk distribution
    high_risk = db.query(func.count(ProjectRisk.project_id))\
        .filter(ProjectRisk.risk_level == "HIGH").scalar() or 0
        
    med_risk = db.query(func.count(ProjectRisk.project_id))\
        .filter(ProjectRisk.risk_level == "MEDIUM").scalar() or 0
        
    low_risk = db.query(func.count(ProjectRisk.project_id))\
        .filter(ProjectRisk.risk_level == "LOW").scalar() or 0

    # 3. Calculate total money tied to flagged projects (HIGH + MEDIUM risk)
    # Using Member 1's 'allocated_amount' column
    flagged_amount = (
        db.query(func.sum(Project.allocated_amount))
        .join(ProjectRisk, Project.project_id == ProjectRisk.project_id)
        .filter(ProjectRisk.risk_level.in_(["HIGH", "MEDIUM"]))
        .scalar() or 0.0
    )

    # 4. Map SQL results exactly to Member 4's expected JSON format
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