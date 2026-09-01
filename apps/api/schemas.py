from typing import List, Optional
from pydantic import BaseModel, Field

<<<<<<< HEAD
<<<<<<< HEAD
# --- Core Sub-components ---
=======
>>>>>>> b5dd076 (First commit from Backend Side)
=======
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
class RiskSignal(BaseModel):
    type: str = Field(..., example="COST_ANOMALY")
    severity: str = Field(..., example="HIGH")
    explanation: str = Field(..., example="Project amount is 2.3x the peer-group median.")
<<<<<<< HEAD
<<<<<<< HEAD

class TimelineEvent(BaseModel):
    type: str = Field(..., example="RECOMMENDATION")
    date: Optional[str] = Field(None, example="2025-06-10") # ISO YYYY-MM-DD
    status: str = Field(..., example="completed")

# --- Main API Responses ---

class ProjectBase(BaseModel):
    project_id: str
    project_name: str
    state: Optional[str] = None
    constituency: Optional[str] = None
    category: Optional[str] = None
    amount: float # Strictly numeric
    status: str
    recommendation_date: Optional[str] = None # ISO YYYY-MM-DD
    risk_score: Optional[int] = Field(None, ge=0, le=100)
    risk_level: Optional[str] = Field(None, example="HIGH") # LOW / MEDIUM / HIGH

class ProjectListResponse(BaseModel):
    items: List[ProjectBase]
    total: int
    page: int
    page_size: int

class ProjectRiskItem(BaseModel):
    project_id: str
    risk_score: int = Field(..., ge=0, le=100)
    risk_level: str
    signals: List[RiskSignal]

class RiskListResponse(BaseModel):
    items: List[ProjectRiskItem]

class AnalyticsOverview(BaseModel):
    total_projects: int
    high_risk_projects: int
    medium_risk_projects: int
    under_review_projects: int
    flagged_amount: float
    risk_distribution: dict

class SimilarProject(BaseModel):
    project_id: str
    description: str
    similarity_score: float
    state: Optional[str] = None
    constituency: Optional[str] = None

class SimilarProjectsResponse(BaseModel):
    items: List[SimilarProject]

class TimelineResponse(BaseModel):
    events: List[TimelineEvent]

class EvidenceResponse(BaseModel):
=======
=======
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
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
<<<<<<< HEAD
    limit: int
=======
    page_size: int
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
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
<<<<<<< HEAD
>>>>>>> b5dd076 (First commit from Backend Side)
=======
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
    project_amount: float
    peer_median: float
    peer_min: float
    peer_max: float
<<<<<<< HEAD
<<<<<<< HEAD
    matching_project_ids: Optional[List[str]] = None
    timeline_anomaly_details: Optional[str] = None
=======
    peer_sample_count: int
>>>>>>> b5dd076 (First commit from Backend Side)
=======
    peer_sample_count: int
>>>>>>> 7e53b5b (Revert "First commit from Backend Side")
