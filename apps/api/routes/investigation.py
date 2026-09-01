from typing import List
from fastapi import APIRouter, HTTPException
from schemas import SimilarProject, TimelineStage, PeerComparison

router = APIRouter(prefix="/projects", tags=["Investigation & Evidence"])

@router.get("/{project_id}/similar", response_model=List[SimilarProject])
def get_similar_projects(project_id: str):
    """Identifies overlapping or duplicate works using embedding/text-similarity (Member 2)."""
    return [
        SimilarProject(
            project_id="MPLADS-2023-KA-0042",
            title="Upgradation & Renovation of Kengeri Panchayat Hall",
            similarity_score=0.89,
            distance_km=0.6,
            state="Karnataka",
            constituency="Bangalore Rural",
            sanctioned_amount=1500000.0
        ),
        SimilarProject(
            project_id="MPLADS-2023-KA-0019",
            title="Construction of Multi-purpose Hall at Kengeri Ward 4",
            similarity_score=0.74,
            distance_km=2.1,
            state="Karnataka",
            constituency="Bangalore Rural",
            sanctioned_amount=1800000.0
        )
    ]

@router.get("/{project_id}/timeline", response_model=List[TimelineStage])
def get_project_timeline(project_id: str):
    """Chronological milestone breakdown with execution anomaly flags."""
    return [
        TimelineStage(
            stage="Recommendation by MP",
            date="2023-01-15",
            status="COMPLETED",
            is_anomaly=False
        ),
        TimelineStage(
            stage="Administrative & Technical Sanction",
            date="2023-04-12",
            status="COMPLETED",
            is_anomaly=False
        ),
        TimelineStage(
            stage="First Fund Release (80%)",
            date="2023-04-20",
            status="COMPLETED",
            is_anomaly=True,
            observation="80% released within 8 days of sanction before work order issuance."
        ),
        TimelineStage(
            stage="Physical Progress Reported",
            date="2023-09-10",
            status="IN_PROGRESS",
            is_anomaly=False
        ),
        TimelineStage(
            stage="Project Completion Certificate",
            date="2023-11-20",
            status="COMPLETED",
            is_anomaly=False
        )
    ]

@router.get("/{project_id}/evidence", response_model=PeerComparison)
def get_project_evidence(project_id: str):
    """Peer-group cost distribution comparison for the investigation screen (Member 5)."""
    return PeerComparison(
        project_amount=4200000.0,
        peer_median=1750000.0,
        peer_min=1200000.0,
        peer_max=2400000.0,
        peer_sample_count=48
    )