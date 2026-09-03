from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ProjectBase(BaseModel):
    id: str
    state: Optional[str] = None
    constituency: Optional[str] = None
    district: Optional[str] = None
    category: Optional[str] = None
    description: str = "Unknown"
    amount: float = 0.0
    status: str = "Unknown"
    risk: int = 0
    year: int = 2024
    recommendation_date: Optional[str] = None
    risk_level: str = "LOW"

class ProjectListResponse(BaseModel):
    items: List[ProjectBase]
    total: int
    page: int
    page_size: int

class RiskSignal(BaseModel):
    type: str
    severity: str
    explanation: str

class RiskProfileResponse(BaseModel):
    project_id: str
    risk_score: int
    risk_level: str
    signals: List[Dict[str, Any]] = []
    review_status: Optional[str] = None

class AnalyticsOverview(BaseModel):
    total_projects: int
    high_risk_projects: int
    medium_risk_projects: int
    under_review_projects: int
    flagged_amount: float
    risk_distribution: Dict[str, int]

class SimilarProject(BaseModel):
    project_id: str
    description: str
    similarity_score: float
    state: str
    constituency: str

class SimilarProjectsResponse(BaseModel):
    items: List[SimilarProject]

class TimelineEvent(BaseModel):
    type: str
    date: Optional[str] = None
    status: str

class TimelineResponse(BaseModel):
    events: List[TimelineEvent]

class EvidenceResponse(BaseModel):
    project_amount: float
    peer_median: float
    peer_min: float
    peer_max: float
    matching_project_ids: List[str]
    timeline_anomaly_details: Optional[Any] = None
