from typing import List, Optional
from pydantic import BaseModel, Field

class RiskSignal(BaseModel):
    type: str = Field(..., example="COST_ANOMALY")
    severity: str = Field(..., example="HIGH")
    explanation: str = Field(..., example="Project amount is 2.3x the peer-group median.")
    evidence: Optional[dict] = None

class RiskProfileResponse(BaseModel):
    project_id: str
    risk_score: int = Field(..., ge=0, le=100)
    risk_level: str = Field(..., example="HIGH")
    signals: List[RiskSignal] = []
    review_status: str = "UNREVIEWED"

class ProjectBase(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    category: str
    state: str
    constituency: str
    mp_name: str
    sanctioned_amount: float
    expenditure_amount: float
    status: str
    implementing_agency: Optional[str] = None
    sanction_date: Optional[str] = None
    completion_date: Optional[str] = None

class ProjectDetailResponse(ProjectBase):
    risk_profile: Optional[RiskProfileResponse] = None

class ProjectListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    data: List[ProjectDetailResponse]

class AnalyticsOverview(BaseModel):
    total_projects: int
    flagged_projects: int
    high_risk_count: int
    medium_risk_count: int
    total_flagged_amount: float
    top_flagged_states: List[dict]

class SimilarProject(BaseModel):
    project_id: str
    title: str
    similarity_score: float
    distance_km: Optional[float] = None
    state: str
    constituency: str
    sanctioned_amount: float

class TimelineStage(BaseModel):
    stage: str
    date: Optional[str] = None
    status: str
    is_anomaly: bool = False
    observation: Optional[str] = None

class PeerComparison(BaseModel):
    project_amount: float
    peer_median: float
    peer_min: float
    peer_max: float
    peer_sample_count: int
