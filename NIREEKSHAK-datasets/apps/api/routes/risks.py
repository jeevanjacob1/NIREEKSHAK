from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models import ProjectRisk
from schemas import RiskProfileResponse

router = APIRouter(prefix="/risks", tags=["Risk Signals"])

@router.get("", response_model=List[RiskProfileResponse])
def get_all_risks(
    min_score: int = Query(0, ge=0, le=100),
    risk_level: Optional[str] = Query(None),
):
    """Fetch high-risk project registry for anomaly overview queues."""
    from services.engine import engine
    
    risks = engine.get_all_risks(min_score, risk_level)
    return [
        RiskProfileResponse(
            project_id=r["project_id"],
            risk_score=r["risk_score"],
            risk_level=r["risk_level"],
            signals=r["signals"],
            review_status=r["review_status"]
        )
        for r in risks
    ]
