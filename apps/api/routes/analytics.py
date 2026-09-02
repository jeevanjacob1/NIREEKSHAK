from fastapi import APIRouter
from schemas import AnalyticsOverview

router = APIRouter(prefix="/analytics", tags=["Analytics & KPIs"])

@router.get("/overview", response_model=AnalyticsOverview)
def get_analytics_overview():
    """Executive KPI metrics for Command Center Dashboard."""
    return {
        "total_projects": 1420,
        "high_risk_projects": 87,
        "medium_risk_projects": 214,
        "under_review_projects": 45,
        "flagged_amount": 78450000.0,
        "risk_distribution": {
            "HIGH": 87,
            "MEDIUM": 214,
            "LOW": 1119
        }
    }