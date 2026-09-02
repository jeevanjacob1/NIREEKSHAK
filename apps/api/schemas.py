from typing import List, Optional
from pydantic import BaseModel, Field

# --- Core Sub-components ---
class RiskSignal(BaseModel):
    type: str = Field(..., example="COST_ANOMALY")
    severity: str = Field(..., example="HIGH")
    explanation: str = Field(..., example="Project amount is 2.3x the peer-group median.")

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
    project_amount: float
    peer_median: float
    peer_min: float
    peer_max: float
    matching_project_ids: Optional[List[str]] = None
    timeline_anomaly_details: Optional[str] = None