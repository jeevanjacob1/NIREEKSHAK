from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from database import get_db
# Import the new tables
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
    # Base query joined with relational tables
    query = db.query(Project)\
        .outerjoin(State, Project.state_id == State.state_id)\
        .outerjoin(Constituency, Project.constituency_id == Constituency.constituency_id)

    # Search against Member 1's field names, but using frontend's query params
    if search:
        query = query.filter(Project.work_description.ilike(f"%{search}%"))
    if state:
        query = query.filter(State.state_name.ilike(f"%{state}%"))
    if constituency:
        query = query.filter(Constituency.constituency_name.ilike(f"%{constituency}%"))

    total = query.count()
    db_projects = query.offset((page - 1) * page_size).limit(page_size).all()

    items = []
    for p in db_projects:
        # 1. Map Member 1's database attributes -> Member 4's JSON schema
        # 2. Extract text names from the relational objects (p.state.state_name)
        # 3. Handle dates properly (.isoformat() converts date object to YYYY-MM-DD string)
        
        items.append(ProjectBase(
            project_id=p.project_id,
            project_name=p.work_description or "Unknown Work",
            state=p.state.state_name if p.state else None,
            constituency=p.constituency.constituency_name if p.constituency else None,
            category=p.category,
            amount=float(p.allocated_amount) if p.allocated_amount else 0.0,
            status=p.project_status or "Unknown",
            recommendation_date=p.recommendation_date.isoformat() if p.recommendation_date else None,
            risk_score=p.risk_profile.risk_score if p.risk_profile else 0,
            risk_level=p.risk_profile.risk_level if p.risk_profile else "LOW"
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

    return ProjectBase(
        project_id=p.project_id,
        project_name=p.work_description or "Unknown Work",
        state=p.state.state_name if p.state else None,
        constituency=p.constituency.constituency_name if p.constituency else None,
        category=p.category,
        amount=float(p.allocated_amount) if p.allocated_amount else 0.0,
        status=p.project_status or "Unknown",
        recommendation_date=p.recommendation_date.isoformat() if p.recommendation_date else None,
        risk_score=p.risk_profile.risk_score if p.risk_profile else 0,
        risk_level=p.risk_profile.risk_level if p.risk_profile else "LOW"
    )