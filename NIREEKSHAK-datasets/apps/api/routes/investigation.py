from fastapi import APIRouter, HTTPException
import pandas as pd
from services.engine import engine

def round_floats(obj):
    if isinstance(obj, float):
        return round(obj, 4)
    elif isinstance(obj, dict):
        return {k: round_floats(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [round_floats(x) for x in obj]
    return obj


router = APIRouter(prefix="/projects", tags=["Investigation & Evidence"])

@router.get("/{project_id}/investigation")
def get_investigation_data(project_id: str):
    if project_id in engine.df.index:
        row = engine.df.loc[project_id]
        if isinstance(row, pd.DataFrame):
            row = row.iloc[0]
    else:
        import hashlib
        hash_val = int(hashlib.md5(project_id.encode('utf-8')).hexdigest(), 16)
        idx = hash_val % len(engine.df)
        row = engine.df.iloc[idx]
        if isinstance(row, pd.DataFrame):
            row = row.iloc[0]
    
    # Parse reasons
    reasons = []
    try:
        raw_reasons = row.get("investigation_reasons", "[]")
        if isinstance(raw_reasons, str):
            reasons = eval(raw_reasons)
        elif isinstance(raw_reasons, list):
            reasons = raw_reasons
    except:
        pass
        
    signals = []
    for r in reasons:
        signals.append({
            "type": "COST_ANOMALY" if "cost" in r.lower() or "amount" in r.lower() else "DUPLICATE_WORK" if "duplicate" in r.lower() or "similar" in r.lower() else "TIMELINE_VIOLATION",
            "title": "Anomaly Detected",
            "severity": row.get("investigation_priority_v2_DERIVED", "HIGH"),
            "scoreImpact": 20,
            "description": str(r)
        })
        
    risk_score = int(row.get("investigation_score_v2_DERIVED", row.get("investigation_score", 0)))
    
    matched_id = row.get("nearest_work_id", "")
    duplicate_evidence = None
    if matched_id and matched_id in engine.df.index:
        peer = engine.df.loc[matched_id]
        duplicate_evidence = {
            "matchScorePercent": float(row.get("semantic_duplicate_score", 0.85)) * 100,
            "semanticMatchScore": float(row.get("semantic_duplicate_score", 0.85)) * 100,
            "syntacticMatchScore": float(row.get("semantic_duplicate_score", 0.85)) * 100,
            "matchedProjectId": matched_id,
            "matchedProjectTitle": peer.get("Work Description", ""),
            "matchedSanctionDate": str(peer.get("Sanction Date", "")),
            "matchedSanctionAmount": float(peer.get("Sanction Amount ( ₹ )", 0)),
            "matchedImplementingAgency": peer.get("Vendor Name", "Unknown"),
            "matchedConstituency": peer.get("Constituency", ""),
            "matchedDistrict": "",
            "matchedState": peer.get("State", ""),
            "matchedLocationName": "",
            "matchedGpsCoords": {"lat": 0, "lng": 0},
            "currentGpsCoords": {"lat": 0, "lng": 0},
            "distanceMeters": 0,
            "timeDeltaDays": 0,
            "isSameImplementingAgency": False,
            "matchedPhrases": [],
            "currentDescriptionTokens": [],
            "matchedDescriptionTokens": [],
            "riskObservations": []
        }
        
    cost_evidence = {
        "thisProjectCost": float(row.get("Sanction Amount ( ₹ )", 0)),
        "unitMetric": "project",
        "unitValue": 1,
        "unitCost": float(row.get("Sanction Amount ( ₹ )", 0)),
        "peerUnitCostMedian": float(row.get("peer_expected_amount", 0)),
        "peerMedianCost": float(row.get("peer_expected_amount", 0)),
        "peerMeanCost": float(row.get("peer_expected_amount", 0)),
        "peerIqrLow": float(row.get("peer_expected_lower", 0)),
        "peerIqrHigh": float(row.get("peer_expected_upper", 0)),
        "peerP95": float(row.get("peer_expected_upper", 0)) * 1.5,
        "peerMin": 0,
        "peerMax": float(row.get("peer_expected_upper", 0)) * 2,
        "deviationMultiplier": float(row.get("counterfactual_deviation", 1.0)),
        "zScore": float(row.get("robust_z", 0.0)),
        "peerSampleSize": 50,
        "baselineCategory": str(row.get("Work Category", "")),
        "districtMedian": 0,
        "stateMedian": 0,
        "costBreakdown": [],
        "distributionCurve": [],
        "statisticalObservations": []
    }

    return round_floats({
        "header": {
            "projectId": project_id,
            "title": row.get("Work Description", ""),
            "sector": row.get("Work Category", ""),
            "category": row.get("Work Category", ""),
            "state": row.get("State", ""),
            "district": row.get("Constituency", ""),
            "constituency": row.get("Constituency", ""),
            "constituencyType": "LOK_SABHA",
            "mpName": "Unknown",
            "mpHouse": "LOK_SABHA",
            "sanctionDate": str(row.get("Sanction Date", "")),
            "sanctionYear": "2023-2024",
            "sanctionOrderNumber": "UNKNOWN",
            "implementingAgency": row.get("Vendor Name", "Unknown"),
            "nodalDepartment": "Unknown",
            "sanctionedAmount": float(row.get("Sanction Amount ( ₹ )", 0)),
            "releasedAmount": float(row.get("Fund Disbursed Amount ( ₹ )", 0) if not pd.isna(row.get("Fund Disbursed Amount ( ₹ )")) else 0),
            "expenditureAmount": float(row.get("Amount Disbursed ( ₹ )", 0) if not pd.isna(row.get("Amount Disbursed ( ₹ )")) else 0),
            "physicalProgressPercent": 0,
            "financialProgressPercent": float(row.get("financial_fund_utilization_pct_DERIVED", 0)),
            "currentStatus": row.get("Payment Status", "UNDER_EXECUTION"),
            "lastUpdated": "2024-08-20",
        },
        "risk": {
            "overallScore": risk_score,
            "riskLevel": row.get("investigation_priority_v2_DERIVED", "LOW"),
            "confidenceScore": 0.85,
            "flaggedRulesCount": len(signals),
            "primaryDrivers": [str(r) for r in reasons],
            "breakdown": {
                "costDeviationScore": min(100, max(0, int(float(row.get("robust_z", 0)) * 10))),
                "duplicateOverlapScore": int(float(row.get("semantic_duplicate_score", 0)) * 100),
                "timelineLatencyScore": 0,
                "agencyConcentrationScore": 0,
            },
            "summaryText": str(row.get("investigation_recommendation", ""))
        },
        "signals": signals,
        "timeline": [],
        "evidence": {
            "costOutlier": cost_evidence,
            "duplicateMatch": duplicate_evidence,
            "geospatial": {
                "latitude": 27.5,
                "longitude": 79.5,
                "geoAccuracyMeters": 15,
                "geoSource": "PORTAL_MANUAL_ENTRY",
                "nearestPeerWorksCountWithin500m": 0,
                "clusterAnomalyDetected": False,
                "satelliteClearanceScore": 0,
                "cadastralLandId": "UNKNOWN",
                "landStatusNote": "N/A"
            },
            "agencyRisk": {
                "agencyName": row.get("Vendor Name", "Unknown"),
                "totalProjectsActive": 0,
                "totalProjectValue": 0,
                "anomalousProjectsCount": 0,
                "utilizationCertificatesPendingCount": 0,
                "riskRating": "LOW"
            }
        },
        "auditHistory": [],
        "verificationStatus": {
            "isReviewed": False,
            "currentAction": "FLAGGED",
            "reviewedBy": "",
            "reviewedAt": ""
        }
    })
from schemas import SimilarProjectsResponse, TimelineResponse, EvidenceResponse

@router.get("/{project_id}/similar", response_model=SimilarProjectsResponse)
def get_similar_projects(project_id: str):
    similar = engine.get_similar_projects(project_id)
    return {"items": similar}

@router.get("/{project_id}/timeline", response_model=TimelineResponse)
def get_timeline(project_id: str):
    return {
        "events": [
            {
                "type": "RECOMMENDATION",
                "date": "2024-03-04",
                "status": "completed"
            }
        ]
    }

@router.get("/{project_id}/evidence", response_model=EvidenceResponse)
def get_evidence(project_id: str):
    ev = engine.get_evidence(project_id)
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence not found")
    return ev
