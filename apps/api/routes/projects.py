from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Project
from schemas import ProjectListResponse, ProjectDetailResponse, RiskProfileResponse, RiskSignal

router = APIRouter(prefix="/projects", tags=["Projects"])

# Fallback in-memory dataset for unblocked frontend development
MOCK_PROJECTS = [
    {
        "project_id": "MPLADS-RJ-001",
        "project_name": "NA - Installing community drinking water plants",
        "state": "Rajasthan",
        "constituency": "KARAULI-DHOLPUR(SC)",
        "category": "Normal/Others",
        "amount": 100000.0,
        "status": "Unsanctioned",
        "recommendation_date": "2024-03-04", # Converted to ISO
        "risk_score": 87,
        "risk_level": "HIGH"
    },
    {
        "project_id": "MPLADS-BR-002",
        "project_name": "NA - Street lights",
        "state": "Bihar",
        "constituency": "DARBHANGA",
        "category": "Normal/Others",
        "amount": 487000.0,
        "status": "Unsanctioned",
        "recommendation_date": "2024-03-04", # Converted to ISO
        "risk_score": 12,
        "risk_level": "LOW"
    }
]

@router.get("", response_model=ProjectListResponse)
def get_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    constituency: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    db: Optional[Session] = Depends(get_db)
):
    """Retrieve filtered, paginated list of projects."""
    if db is not None:
        try:
            query = db.query(Project)
            if search:
                query = query.filter(Project.title.ilike(f"%{search}%"))
            if state:
                query = query.filter(Project.state.ilike(f"%{state}%"))
            if constituency:
                query = query.filter(Project.constituency.ilike(f"%{constituency}%"))
            
            total = query.count()
            db_projects = query.offset((page - 1) * page_size).page_size(page_size).all()
            
            results = []
            for p in db_projects:
                risk_obj = None
                if p.risk_profile:
                    risk_obj = RiskProfileResponse(
                        project_id=p.risk_profile.project_id,
                        risk_score=p.risk_profile.risk_score,
                        risk_level=p.risk_profile.risk_level,
                        signals=p.risk_profile.signals or [],
                        review_status=p.risk_profile.review_status
                    )
                results.append(ProjectDetailResponse(**p.__dict__, risk_profile=risk_obj))
            return ProjectListResponse(total=total, page=page, page_size=page_size, data=results)
        except Exception:
            pass  # Fall back to mock on db exception

    # Mock Response Logic
    filtered = MOCK_PROJECTS
    if state:
        filtered = [p for p in filtered if p["state"].lower() == state.lower()]
    if search:
        filtered = [p for p in filtered if search.lower() in p["title"].lower()]
    if risk_level:
        filtered = [p for p in filtered if p["risk_profile"]["risk_level"].upper() == risk_level.upper()]

    return ProjectListResponse(
        total=len(filtered),
        page=page,
        page_size=page_size,
        data=filtered[(page - 1) * page_size : page * page_size]
    )

@router.get("/{project_id}", response_model=ProjectDetailResponse)
def get_project_by_id(project_id: str, db: Optional[Session] = Depends(get_db)):
    """Retrieve detailed metadata and risk profile of a single project."""
    if db is not None:
        try:
            proj = db.query(Project).filter(Project.id == project_id).first()
            if proj:
                risk_obj = None
                if proj.risk_profile:
                    risk_obj = RiskProfileResponse(
                        project_id=proj.risk_profile.project_id,
                        risk_score=proj.risk_profile.risk_score,
                        risk_level=proj.risk_profile.risk_level,
                        signals=proj.risk_profile.signals or [],
                        review_status=proj.risk_profile.review_status
                    )
                return ProjectDetailResponse(**proj.__dict__, risk_profile=risk_obj)
        except Exception:
            pass

    for p in MOCK_PROJECTS:
        if p["id"] == project_id:
            return p

    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")