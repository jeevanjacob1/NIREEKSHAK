from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Project
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
from schemas import ProjectListResponse, ProjectBase

router = APIRouter(prefix="/projects", tags=["Projects"])

# Fallback in-memory dataset using real MPLADS.csv data
=======
=======
>>>>>>> 787116b (Making changes for datasets)
from schemas import ProjectListResponse, ProjectDetailResponse, RiskProfileResponse, RiskSignal

router = APIRouter(prefix="/projects", tags=["Projects"])

# Fallback in-memory dataset for unblocked frontend development
<<<<<<< HEAD
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
=======
=======
from schemas import ProjectListResponse, ProjectBase

router = APIRouter(prefix="/projects", tags=["Projects"])

# Fallback in-memory dataset using real MPLADS.csv data
>>>>>>> ffedff0 (Making changes for datasets)
>>>>>>> 787116b (Making changes for datasets)
MOCK_PROJECTS = [
    {
        "project_id": "MPLADS-RJ-001",
        "project_name": "NA - Installing community drinking water plants",
        "state": "Rajasthan",
        "constituency": "KARAULI-DHOLPUR(SC)",
        "category": "Normal/Others",
        "amount": 100000.0,
        "status": "Unsanctioned",
<<<<<<< HEAD
<<<<<<< HEAD
        "recommendation_date": "2024-03-04",
=======
        "recommendation_date": "2024-03-04", # Converted to ISO
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
=======
        "recommendation_date": "2024-03-04", # Converted to ISO
=======
        "recommendation_date": "2024-03-04",
>>>>>>> ffedff0 (Making changes for datasets)
>>>>>>> 787116b (Making changes for datasets)
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
<<<<<<< HEAD
<<<<<<< HEAD
        "recommendation_date": "2024-03-04",
        "risk_score": 12,
        "risk_level": "LOW"
=======
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
>>>>>>> b5dd076 (First commit from Backend Side)
=======
=======
>>>>>>> 787116b (Making changes for datasets)
        "recommendation_date": "2024-03-04", # Converted to ISO
=======
        "recommendation_date": "2024-03-04",
>>>>>>> ffedff0 (Making changes for datasets)
        "risk_score": 12,
        "risk_level": "LOW"
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
    }
]

@router.get("", response_model=ProjectListResponse)
def get_projects(
    page: int = Query(1, ge=1),
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    constituency: Optional[str] = Query(None),
=======
    limit: int = Query(10, ge=1, le=100),
=======
=======
>>>>>>> 787116b (Making changes for datasets)
    page_size: int = Query(10, ge=1, le=100),
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
    search: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    constituency: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> b5dd076 (First commit from Backend Side)
=======
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
=======
=======
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    constituency: Optional[str] = Query(None),
>>>>>>> ffedff0 (Making changes for datasets)
>>>>>>> 787116b (Making changes for datasets)
    db: Optional[Session] = Depends(get_db)
):
    """Retrieve filtered, paginated list of projects."""
    if db is not None:
        try:
            query = db.query(Project)
            if search:
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                query = query.filter(Project.project_name.ilike(f"%{search}%"))
=======
                query = query.filter(Project.title.ilike(f"%{search}%"))
>>>>>>> b5dd076 (First commit from Backend Side)
=======
                query = query.filter(Project.title.ilike(f"%{search}%"))
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
=======
                query = query.filter(Project.title.ilike(f"%{search}%"))
=======
                query = query.filter(Project.project_name.ilike(f"%{search}%"))
>>>>>>> ffedff0 (Making changes for datasets)
>>>>>>> 787116b (Making changes for datasets)
            if state:
                query = query.filter(Project.state.ilike(f"%{state}%"))
            if constituency:
                query = query.filter(Project.constituency.ilike(f"%{constituency}%"))
            
            total = query.count()
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
            db_projects = query.offset((page - 1) * limit).limit(limit).all()
=======
=======
>>>>>>> 787116b (Making changes for datasets)
            db_projects = query.offset((page - 1) * page_size).page_size(page_size).all()
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
            
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
<<<<<<< HEAD
            return ProjectListResponse(total=total, page=page, limit=limit, data=results)
>>>>>>> b5dd076 (First commit from Backend Side)
=======
            return ProjectListResponse(total=total, page=page, page_size=page_size, data=results)
<<<<<<< HEAD
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
=======
=======
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
>>>>>>> ffedff0 (Making changes for datasets)
>>>>>>> 787116b (Making changes for datasets)
        except Exception:
            pass  # Fall back to mock on db exception

    # Mock Response Logic
    filtered = MOCK_PROJECTS
    if state:
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
=======
>>>>>>> 787116b (Making changes for datasets)
        filtered = [p for p in filtered if p["state"].lower() == state.lower()]
    if search:
        filtered = [p for p in filtered if search.lower() in p["title"].lower()]
    if risk_level:
        filtered = [p for p in filtered if p["risk_profile"]["risk_level"].upper() == risk_level.upper()]

    return ProjectListResponse(
        total=len(filtered),
        page=page,
<<<<<<< HEAD
        limit=limit,
        data=filtered[(page - 1) * limit : page * limit]
=======
        page_size=page_size,
        data=filtered[(page - 1) * page_size : page * page_size]
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
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
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> b5dd076 (First commit from Backend Side)
=======
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
=======
=======
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
>>>>>>> ffedff0 (Making changes for datasets)
>>>>>>> 787116b (Making changes for datasets)
        except Exception:
            pass

    for p in MOCK_PROJECTS:
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        if p["project_id"] == project_id:
            return p

    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
=======
=======
>>>>>>> 787116b (Making changes for datasets)
        if p["id"] == project_id:
=======
        if p["project_id"] == project_id:
>>>>>>> ffedff0 (Making changes for datasets)
            return p

    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
>>>>>>> b5dd076 (First commit from Backend Side)
=======
        if p["id"] == project_id:
            return p

    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
