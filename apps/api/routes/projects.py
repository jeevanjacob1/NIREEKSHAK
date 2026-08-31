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
        "id": "MPLADS-2024-KA-0089",
        "title": "Construction of Community Hall at Village Kengeri",
        "description": "Proposal for new RCC community center building with modern amenities and sanitation.",
        "category": "Community Infrastructure",
        "state": "Karnataka",
        "constituency": "Bangalore Rural",
        "mp_name": "D.K. Suresh",
        "sanctioned_amount": 4200000.0,
        "expenditure_amount": 3950000.0,
        "status": "Completed",
        "implementing_agency": "Rural Development & Panchayat Raj",
        "sanction_date": "2023-04-12",
        "completion_date": "2023-11-20",
        "risk_profile": {
            "project_id": "MPLADS-2024-KA-0089",
            "risk_score": 87,
            "risk_level": "HIGH",
            "review_status": "NEEDS_INVESTIGATION",
            "signals": [
                {
                    "type": "COST_ANOMALY",
                    "severity": "HIGH",
                    "explanation": "Project amount is 2.4x the peer-group median for rural community halls.",
                    "evidence": {"peer_median": 1750000.0, "current": 4200000.0}
                },
                {
                    "type": "DUPLICATE_WORK",
                    "severity": "HIGH",
                    "explanation": "89% semantic overlap with project sanctioned 6 months earlier in the same ward.",
                    "evidence": {"matching_project_id": "MPLADS-2023-KA-0042"}
                }
            ]
        }
    },
    {
        "id": "MPLADS-2024-MH-0112",
        "title": "Installation of High Mast Solar Streetlights",
        "description": "Installation of 25 units of 120W LED solar high mast lighting systems across gram panchayats.",
        "category": "Renewable Energy / Lighting",
        "state": "Maharashtra",
        "constituency": "Pune",
        "mp_name": "Girish Bapat",
        "sanctioned_amount": 1800000.0,
        "expenditure_amount": 1800000.0,
        "status": "Sanctioned",
        "implementing_agency": "MSEDCL Local Division",
        "sanction_date": "2024-01-10",
        "completion_date": None,
        "risk_profile": {
            "project_id": "MPLADS-2024-MH-0112",
            "risk_score": 32,
            "risk_level": "LOW",
            "review_status": "VERIFIED",
            "signals": []
        }
    }
]

@router.get("", response_model=ProjectListResponse)
def get_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
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
            db_projects = query.offset((page - 1) * limit).limit(limit).all()
            
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
            return ProjectListResponse(total=total, page=page, limit=limit, data=results)
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
        limit=limit,
        data=filtered[(page - 1) * limit : page * limit]
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
