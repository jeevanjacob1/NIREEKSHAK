<<<<<<< HEAD
<<<<<<< HEAD
from fastapi import APIRouter
=======
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
>>>>>>> b5dd076 (First commit from Backend Side)
=======
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
>>>>>>> b042b8b (Made som changes in backend)
from schemas import AnalyticsOverview

router = APIRouter(prefix="/analytics", tags=["Analytics & KPIs"])

@router.get("/overview", response_model=AnalyticsOverview)
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> b042b8b (Made som changes in backend)
def get_analytics_overview(db: Session = Depends(get_db)):
    """Executive KPI metrics for Command Center Dashboard (Member 4)."""
    return AnalyticsOverview(
        total_projects=1420,
        flagged_projects=187,
        high_risk_count=42,
        medium_risk_count=145,
        total_flagged_amount=78450000.0,
        top_flagged_states=[
            {"state": "Karnataka", "flagged_count": 45, "total_risk_amount": 18500000.0},
            {"state": "Maharashtra", "flagged_count": 38, "total_risk_amount": 16200000.0},
            {"state": "Uttar Pradesh", "flagged_count": 34, "total_risk_amount": 14100000.0},
            {"state": "Bihar", "flagged_count": 27, "total_risk_amount": 11300000.0}
        ]
<<<<<<< HEAD
    )
>>>>>>> b5dd076 (First commit from Backend Side)
=======
    )
>>>>>>> b042b8b (Made som changes in backend)
