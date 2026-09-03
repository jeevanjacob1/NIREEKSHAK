from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Project, State, Constituency 
from schemas import ProjectListResponse, ProjectBase

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=ProjectListResponse)
def get_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    constituency: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Project)\
        .outerjoin(State, Project.state_id == State.state_id)\
        .outerjoin(Constituency, Project.constituency_id == Constituency.constituency_id)

    if search:
        query = query.filter(Project.work_description.ilike(f"%{search}%"))
    if state:
        query = query.filter(State.state_name.ilike(f"%{state}%"))
    if constituency:
        query = query.filter(Constituency.constituency_name.ilike(f"%{constituency}%"))

    total = query.count()
    db_projects = query.offset((page - 1) * page_size).limit(page_size).all()

    from services.engine import engine

    items = []
    for p in db_projects:
        year = 2024
        if p.recommendation_date:
            year = p.recommendation_date.year

        risk_data = engine.get_project_risk(p.project_id)
        if risk_data:
            risk = risk_data["score"]
            risk_level = risk_data["level"]
        else:
            risk = 0
            risk_level = "LOW"

        items.append(ProjectBase(
            id=p.project_id,
            description=p.work_description or "Unknown Work",
            state=p.state.state_name if p.state else "Unknown State",
            constituency=p.constituency.constituency_name if p.constituency else "Unknown",
            district=p.city or p.block or "Unknown",
            category=p.category or "Other",
            amount=float(p.allocated_amount) if p.allocated_amount else 0.0,
            status=p.project_status or "Unknown",
            year=year,
            recommendation_date=p.recommendation_date.isoformat() if p.recommendation_date else None,
            risk=risk,
            risk_level=risk_level
        ))

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size
    }

@router.get("/{project_id}", response_model=ProjectBase)
def get_project_by_id(project_id: str, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.project_id == project_id).first()
    
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")

    year = 2024
    if p.recommendation_date:
        year = p.recommendation_date.year

    from services.engine import engine
    risk_data = engine.get_project_risk(p.project_id)
    if risk_data:
        risk = risk_data["score"]
        risk_level = risk_data["level"]
    else:
        risk = 0
        risk_level = "LOW"

    return ProjectBase(
        id=p.project_id,
        description=p.work_description or "Unknown Work",
        state=p.state.state_name if p.state else "Unknown State",
        constituency=p.constituency.constituency_name if p.constituency else "Unknown",
        district=p.city or p.block or "Unknown",
        category=p.category or "Other",
        amount=float(p.allocated_amount) if p.allocated_amount else 0.0,
        status=p.project_status or "Unknown",
        year=year,
        recommendation_date=p.recommendation_date.isoformat() if p.recommendation_date else None,
        risk=risk,
        risk_level=risk_level
    )