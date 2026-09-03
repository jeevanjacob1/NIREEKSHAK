export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type InvestigationAction =
  | 'MARK_FOR_REVIEW'
  | 'UNDER_INVESTIGATION'
  | 'DISMISS_CLEAR'
  | 'ESCALATE_VIGILANCE';

export type TimelineStepStatus =
  | 'COMPLETED'
  | 'IN_PROGRESS'
  | 'DELAYED'
  | 'ANOMALOUS'
  | 'PENDING';

export type AnomalySignalType =
  | 'COST_ANOMALY'
  | 'DUPLICATE_WORK'
  | 'TIMELINE_VIOLATION'
  | 'GEOSPATIAL_ANOMALY'
  | 'AGENCY_CONCENTRATION';

export interface AnomalySignal {
  type: AnomalySignalType;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  scoreImpact: number;
  description: string;
}

export interface ProjectHeader {
  projectId: string;
  title: string;
  sector: string;
  category: string;
  state: string;
  district: string;
  constituency: string;
  constituencyType: 'LOK_SABHA' | 'RAJYA_SABHA';
  mpName: string;
  mpHouse: string;
  sanctionDate: string;
  sanctionYear: string;
  sanctionOrderNumber: string;
  implementingAgency: string;
  nodalDepartment: string;
  sanctionedAmount: number; // in INR
  releasedAmount: number;   // in INR
  expenditureAmount: number; // in INR
  physicalProgressPercent: number;
  financialProgressPercent: number;
  currentStatus: 'UNDER_EXECUTION' | 'COMPLETED' | 'STALLED' | 'RECOMMENDED';
  lastUpdated: string;
}

export interface RiskScoreBreakdown {
  costDeviationScore: number;    // 0-100
  duplicateOverlapScore: number;  // 0-100
  timelineLatencyScore: number;   // 0-100
  agencyConcentrationScore: number; // 0-100
}

export interface RiskAssessment {
  overallScore: number; // 0-100
  riskLevel: RiskLevel;
  confidenceScore: number; // 0.00 - 1.00
  flaggedRulesCount: number;
  primaryDrivers: string[];
  breakdown: RiskScoreBreakdown;
  summaryText: string;
}

export interface CostBreakdownItem {
  component: string;
  projectCost: number;
  peerAverageCost: number;
  deviationPercent: number;
  anomalyFlag: boolean;
  notes: string;
}

export interface PeerDistributionPoint {
  percentile: string;
  cost: number; // in INR
  label: string;
}

export interface CostOutlierEvidence {
  thisProjectCost: number;
  unitMetric: string;
  unitValue: number;
  unitCost: number;
  peerUnitCostMedian: number;
  peerMedianCost: number;
  peerMeanCost: number;
  peerIqrLow: number;  // 25th percentile (Q1)
  peerIqrHigh: number; // 75th percentile (Q3)
  peerP95: number;     // 95th percentile
  peerMin: number;
  peerMax: number;
  deviationMultiplier: number; // e.g. 2.43x
  zScore: number;              // e.g. +3.42
  peerSampleSize: number;      // N
  baselineCategory: string;
  districtMedian: number;
  stateMedian: number;
  costBreakdown: CostBreakdownItem[];
  distributionCurve: PeerDistributionPoint[];
  statisticalObservations: string[];
}

export interface MatchedTokenDiff {
  text: string;
  isMatched: boolean;
  type?: 'identical' | 'near_match' | 'unique_current' | 'unique_matched';
}

export interface DuplicateMatchEvidence {
  matchScorePercent: number; // e.g. 91.4
  semanticMatchScore: number;
  syntacticMatchScore: number;
  matchedProjectId: string;
  matchedProjectTitle: string;
  matchedSanctionDate: string;
  matchedSanctionAmount: number;
  matchedImplementingAgency: string;
  matchedConstituency: string;
  matchedDistrict: string;
  matchedState: string;
  matchedLocationName: string;
  matchedGpsCoords: { lat: number; lng: number };
  currentGpsCoords: { lat: number; lng: number };
  distanceMeters: number;
  timeDeltaDays: number;
  isSameImplementingAgency: boolean;
  matchedPhrases: string[];
  currentDescriptionTokens: MatchedTokenDiff[];
  matchedDescriptionTokens: MatchedTokenDiff[];
  riskObservations: string[];
}

export interface TimelineAuditLog {
  date: string;
  event: string;
  recordedBy: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface TimelineStep {
  stepId: string;
  stageKey: 'RECOMMENDATION' | 'SANCTION' | 'FUND_RELEASE' | 'EXECUTION' | 'COMPLETION';
  title: string;
  subtitle: string;
  status: TimelineStepStatus;
  plannedDate: string;
  actualDate: string | null;
  elapsedDays: number;
  standardSlaDays: number;
  deltaDays: number;
  disbursedPercentCumulative: number;
  physicalProgressPercentCumulative: number;
  isAnomalous: boolean;
  anomalyTitle?: string;
  anomalyDescription?: string;
  logs: TimelineAuditLog[];
}

export interface GeospatialEvidence {
  latitude: number;
  longitude: number;
  geoAccuracyMeters: number;
  geoSource: 'MOBILE_APP_ON_SITE' | 'PORTAL_MANUAL_ENTRY' | 'SURVEYOR_DPR';
  nearestPeerWorksCountWithin500m: number;
  clusterAnomalyDetected: boolean;
  satelliteClearanceScore: number; // 0-100
  cadastralLandId: string;
  landStatusNote: string;
}

export interface AgencyRiskEvidence {
  agencyName: string;
  contractorName: string;
  activeProjectsInBlockCount: number;
  totalWorksSanctionedCount: number;
  flaggedProjectsCount: number;
  allocationSharePercentInBlock: number;
  averageExecutionDelayDays: number;
  utilizationCertificatesPendingCount: number;
  riskRating: 'ELEVATED' | 'HIGH' | 'MODERATE' | 'LOW';
}

export interface AuditHistoryEntry {
  id: string;
  timestamp: string;
  officerId: string;
  officerName: string;
  officerDesignation: string;
  action: InvestigationAction;
  actionLabel: string;
  reviewNotes: string;
  tags: string[];
}

export interface ProjectInvestigationData {
  header: ProjectHeader;
  risk: RiskAssessment;
  signals?: AnomalySignal[];
  evidence: {
    costOutlier: CostOutlierEvidence;
    duplicateMatch: DuplicateMatchEvidence;
    geospatial: GeospatialEvidence;
    agencyRisk: AgencyRiskEvidence;
  };
  timeline: TimelineStep[];
  auditHistory: AuditHistoryEntry[];
  verificationStatus: {
    isReviewed: boolean;
    currentAction: InvestigationAction | null;
    reviewedBy?: string;
    reviewedAt?: string;
    reviewNotes?: string;
    tags?: string[];
  };
}

export interface VerifyInvestigationRequest {
  projectId: string;
  action: InvestigationAction;
  reviewNotes: string;
  officerId: string;
  officerName: string;
  officerDesignation: string;
  tags: string[];
  timestamp?: string;
}

export interface VerifyInvestigationResponse {
  success: boolean;
  message: string;
  updatedStatus: {
    projectId: string;
    action: InvestigationAction;
    reviewedBy: string;
    reviewedAt: string;
    auditLogId: string;
  };
}
