from fastapi import APIRouter
from schemas import SimilarProjectsResponse, TimelineResponse, EvidenceResponse

router = APIRouter(prefix="/projects", tags=["Investigation & Evidence"])

@router.get("/{project_id}/similar", response_model=SimilarProjectsResponse)
def get_similar_projects(project_id: str):
    """Identifies overlapping or duplicate works."""
    return {
        "items": [
            {
                "project_id": "MPLADS-RJ-042",
                "description": "NA - Installing multiple community water filters",
                "similarity_score": 0.89,
                "state": "Rajasthan",
                "constituency": "KARAULI-DHOLPUR(SC)"
            }
        ]
    }

@router.get("/{project_id}/timeline", response_model=TimelineResponse)
def get_timeline(project_id: str):
    """Chronological milestone breakdown for a specific project."""
    return {
        "events": [
            {
                "type": "RECOMMENDATION",
                "date": "2024-03-04",
                "status": "completed"
            },
            {
                "type": "SANCTION",
                "date": "2024-04-12",
                "status": "completed"
            },
            {
                "type": "FUNDS_RELEASE",
                "date": None,
                "status": "pending"
            }
        ]
    }

@router.get("/{project_id}/evidence", response_model=EvidenceResponse)
def get_evidence(project_id: str):
    """Peer-group cost distribution comparison for the investigation screen."""
    return {
        "project_amount": 100000.0,
        "peer_median": 45000.0,
        "peer_min": 20000.0,
        "peer_max": 120000.0,
        "matching_project_ids": ["MPLADS-RJ-042"],
        "timeline_anomaly_details": None
    }