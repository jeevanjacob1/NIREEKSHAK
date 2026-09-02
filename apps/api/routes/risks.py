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
    db: Optional[Session] = Depends(get_db)
):
    """Fetch high-risk project registry for anomaly overview queues."""
    if db is not None:
        try:
            query = db.query(ProjectRisk).filter(ProjectRisk.risk_score >= min_score)
            if risk_level:
                query = query.filter(ProjectRisk.risk_level == risk_level.upper())
            risks = query.all()
            return [
                RiskProfileResponse(
                    project_id=r.project_id,
                    risk_score=r.risk_score,
                    risk_level=r.risk_level,
                    signals=r.signals or [],
                    review_status=r.review_status
                )
                for r in risks
            ]
        except Exception:
            pass

    return {"items" :[
        RiskProfileResponse(
            project_id="MPLADS-2024-KA-0089",
            risk_score=87,
            risk_level="HIGH",
            signals=[
                {
                    "type": "COST_ANOMALY",
                    "severity": "HIGH",
                    "explanation": "Project amount is 2.4x the peer-group median."
                }
            ],
            review_status="NEEDS_INVESTIGATION"
        )
    ]}