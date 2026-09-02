from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Project
from schemas import ProjectListResponse, ProjectBase

router = APIRouter(prefix="/projects", tags=["Projects"])

# Fallback in-memory dataset using real MPLADS.csv data
MOCK_PROJECTS = [
    {
        "project_id": "MPLADS-RJ-001",
        "project_name": "NA - Installing community drinking water plants",
        "state": "Rajasthan",
        "constituency": "KARAULI-DHOLPUR(SC)",
        "category": "Normal/Others",
        "amount": 100000.0,
        "status": "Unsanctioned",
        "recommendation_date": "2024-03-04",
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
        "recommendation_date": "2024-03-04",
        "risk_score": 12,
        "risk_level": "LOW"
    }
]

@router.get("", response_model=ProjectListResponse)
def get_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    constituency: Optional[str] = Query(None),
    db: Optional[Session] = Depends(get_db)
):
    """Retrieve filtered, paginated list of projects."""
    if db is not None:
        try:
            query = db.query(Project)
            if search:
                query = query.filter(Project.project_name.ilike(f"%{search}%"))
            if state:
                query = query.filter(Project.state.ilike(f"%{state}%"))
            if constituency:
                query = query.filter(Project.constituency.ilike(f"%{constituency}%"))
            
            total = query.count()
            db_projects = query.offset((page - 1) * page_size).limit(page_size).all()
            
            results = []
            for p in db_projects:
                risk_score = None
                risk_level = None
                if p.risk_profile:
                    risk_score = p.risk_profile.risk_score
                    risk_level = p.risk_profile.risk_level
                
                results.append(ProjectBase(
                    project_id=p.project_id,
                    project_name=p.project_name,
                    state=p.state,
                    constituency=p.constituency,
                    category=p.category,
                    amount=p.amount,
                    status=p.status,
                    recommendation_date=p.recommendation_date,
                    risk_score=risk_score,
                    risk_level=risk_level
                ))
            return {"items": results, "total": total, "page": page, "page_size": page_size}
        except Exception:
            pass  # Fall back to mock on db exception

    # Mock Response Logic
    filtered = MOCK_PROJECTS
    if state:
        filtered = [p for p in filtered if p["state"] and state.lower() in p["state"].lower()]
    if search:
        filtered = [p for p in filtered if search.lower() in p["project_name"].lower()]

    paginated_items = filtered[(page - 1) * page_size : page * page_size]
    
    return {
        "items": paginated_items,
        "total": len(filtered),
        "page": page,
        "page_size": page_size
    }

@router.get("/{project_id}", response_model=ProjectBase)
def get_project_by_id(project_id: str, db: Optional[Session] = Depends(get_db)):
    """Retrieve detailed metadata of a single project."""
    if db is not None:
        try:
            p = db.query(Project).filter(Project.project_id == project_id).first()
            if p:
                risk_score = None
                risk_level = None
                if p.risk_profile:
                    risk_score = p.risk_profile.risk_score
                    risk_level = p.risk_profile.risk_level
                
                return ProjectBase(
                    project_id=p.project_id,
                    project_name=p.project_name,
                    state=p.state,
                    constituency=p.constituency,
                    category=p.category,
                    amount=p.amount,
                    status=p.status,
                    recommendation_date=p.recommendation_date,
                    risk_score=risk_score,
                    risk_level=risk_level
                )
        except Exception:
            pass

    for p in MOCK_PROJECTS:
        if p["project_id"] == project_id:
            return p

    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")