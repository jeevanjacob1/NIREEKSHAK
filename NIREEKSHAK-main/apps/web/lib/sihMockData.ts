import {
  ProjectInvestigationData,
  VerifyInvestigationRequest,
  VerifyInvestigationResponse,
} from '../types/investigation';

export const MOCK_PROJECT_INVESTIGATION_DATA: ProjectInvestigationData = {
  header: {
    projectId: 'MPLADS-2024-UP54-0892',
    title: 'Construction of High-Capacity Multi-Purpose Community Hall with Digital Center at Gram Panchayat Rampur Kalan',
    sector: 'Social Infrastructure & Community Welfare',
    category: 'Community Hall / Digital Center',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    constituency: 'Varanasi (UP-54)',
    constituencyType: 'LOK_SABHA',
    mpName: 'Hon. Prime Minister / MP Varanasi',
    mpHouse: 'Lok Sabha (17th/18th)',
    sanctionDate: '2023-10-14',
    sanctionYear: '2023-2024',
    sanctionOrderNumber: 'MPLADS/VNS/2023-24/PW-892/SOC',
    implementingAgency: 'Rural Engineering Services (RES) Division II, Varanasi',
    nodalDepartment: 'District Rural Development Agency (DRDA)',
    sanctionedAmount: 8450000, // ₹ 84.50 Lakhs
    releasedAmount: 8450000,   // ₹ 84.50 Lakhs (100%)
    expenditureAmount: 8450000, // ₹ 84.50 Lakhs recorded disbursed
    physicalProgressPercent: 12.0,
    financialProgressPercent: 100.0,
    currentStatus: 'UNDER_EXECUTION',
    lastUpdated: '2024-08-28T09:42:15Z',
  },
  risk: {
    overallScore: 88,
    riskLevel: 'HIGH',
    confidenceScore: 0.94,
    flaggedRulesCount: 4,
    primaryDrivers: [
      'Cost Deviation: 2.43x above peer median (Z-Score +3.42σ)',
      'High-Risk Duplicate: 91.4% semantic overlap with project 280m away sanctioned 11 months prior',
      'Timeline & Fund Disbursal Inversion: 100% funds released with only 12% physical progress',
      'Agency Concentration: Implementing contractor holds 68% of sector allocation in Varanasi rural block',
    ],
    breakdown: {
      costDeviationScore: 92,
      duplicateOverlapScore: 91,
      timelineLatencyScore: 86,
      agencyConcentrationScore: 78,
    },
    summaryText:
      'Statistical and NLP forensic analysis indicates multiple co-occurring anomalies. Sanctioned unit rate is 2.43x the regional peer baseline, while text parsing detected a high-probability duplicate asset proposal within 280 meters of an active 2022-23 sanction. Immediate physical site verification and DPR reconciliation recommended.',
  },
  evidence: {
    costOutlier: {
      thisProjectCost: 8450000,
      unitMetric: 'Cost per Built-up Sq. Metre',
      unitValue: 1500, // 1500 sq meters
      unitCost: 5633, // ₹ 5,633 / sq.m
      peerUnitCostMedian: 2320, // ₹ 2,320 / sq.m
      peerMedianCost: 3480000, // ₹ 34.80 Lakhs
      peerMeanCost: 3620000,   // ₹ 36.20 Lakhs
      peerIqrLow: 2850000,     // Q1 (25th percentile)
      peerIqrHigh: 4200000,    // Q3 (75th percentile)
      peerP95: 5100000,        // 95th percentile
      peerMin: 1950000,
      peerMax: 8900000,
      deviationMultiplier: 2.43,
      zScore: 3.42,
      peerSampleSize: 418,
      baselineCategory: 'Standard Rural Community Hall (1000-2000 sq.m RCC Structure)',
      districtMedian: 3550000,
      stateMedian: 3420000,
      costBreakdown: [
        {
          component: 'Civil Works & RCC Substructure',
          projectCost: 4620000,
          peerAverageCost: 2150000,
          deviationPercent: 114.8,
          anomalyFlag: true,
          notes: 'Unit concrete rates quoted @ ₹11,400/m³ vs SoR (Schedule of Rates) benchmark ₹5,800/m³',
        },
        {
          component: 'HVAC, Electrical & Solar Rooftop',
          projectCost: 1980000,
          peerAverageCost: 620000,
          deviationPercent: 219.3,
          anomalyFlag: true,
          notes: 'Included non-standard industrial grade inverter specifications and duplicate wiring heads',
        },
        {
          component: 'Digital Center IT Infrastructure & Furniture',
          projectCost: 1250000,
          peerAverageCost: 450000,
          deviationPercent: 177.7,
          anomalyFlag: true,
          notes: 'Terminal workstation hardware priced 180% above GeM (Government e-Marketplace) rate contracts',
        },
        {
          component: 'Site Development, Boundary Wall & Drainage',
          projectCost: 600000,
          peerAverageCost: 400000,
          deviationPercent: 50.0,
          anomalyFlag: false,
          notes: 'Within allowable variance bounds for perimeter boundary masonry',
        },
      ],
      distributionCurve: [
        { percentile: 'Min (0%)', cost: 1950000, label: '₹ 19.5L' },
        { percentile: 'Q1 (25%)', cost: 2850000, label: '₹ 28.5L' },
        { percentile: 'Median (50%)', cost: 3480000, label: '₹ 34.8L' },
        { percentile: 'Q3 (75%)', cost: 4200000, label: '₹ 42.0L' },
        { percentile: 'P95 (95%)', cost: 5100000, label: '₹ 51.0L' },
        { percentile: 'Subject Project', cost: 8450000, label: '₹ 84.5L (2.43x)' },
      ],
      statisticalObservations: [
        'Total project cost of ₹84.50L sits at the 99.8th percentile of 418 peer community halls sanctioned across Eastern Uttar Pradesh between 2021-2024.',
        'Cost deviation multiplier of 2.43x exceeds the forensic statistical threshold (1.50x IQR Upper Bound = ₹62.25L).',
        'Z-Score of +3.42σ confirms extreme statistical anomaly (p < 0.001) under normal tender distribution assumptions.',
      ],
    },
    duplicateMatch: {
      matchScorePercent: 91.4,
      semanticMatchScore: 93.8,
      syntacticMatchScore: 89.0,
      matchedProjectId: 'MPLADS-2023-UP54-0419',
      matchedProjectTitle: 'Establishment of Panchayat Skill & Community Resource Hall at Village Rampur Kalan',
      matchedSanctionDate: '2022-11-18',
      matchedSanctionAmount: 6200000, // ₹ 62.00 Lakhs
      matchedImplementingAgency: 'Rural Engineering Services (RES) Division II, Varanasi',
      matchedConstituency: 'Varanasi (UP-54)',
      matchedDistrict: 'Varanasi',
      matchedState: 'Uttar Pradesh',
      matchedLocationName: 'Gram Panchayat Rampur Kalan (Plot No. 142/A)',
      matchedGpsCoords: { lat: 25.3176, lng: 82.9739 },
      currentGpsCoords: { lat: 25.3198, lng: 82.9762 },
      distanceMeters: 280,
      timeDeltaDays: 330,
      isSameImplementingAgency: true,
      matchedPhrases: [
        'Construction of Community Hall',
        'Panchayat Rampur Kalan',
        'Digital Skill Center and Public IT Hub',
        'RCC Framed Structure with Audio-Visual Equipment',
        'Plot adjacent to Primary School Ground',
      ],
      currentDescriptionTokens: [
        { text: 'Construction of', isMatched: true, type: 'identical' },
        { text: 'High-Capacity Multi-Purpose', isMatched: false, type: 'unique_current' },
        { text: 'Community Hall with', isMatched: true, type: 'identical' },
        { text: 'Digital Center at', isMatched: true, type: 'identical' },
        { text: 'Gram Panchayat Rampur Kalan,', isMatched: true, type: 'identical' },
        { text: 'Varanasi.', isMatched: true, type: 'identical' },
        { text: 'Scope includes 1500 sq.m hall,', isMatched: false, type: 'unique_current' },
        { text: 'solar rooftop, and dedicated e-governance kiosk.', isMatched: true, type: 'near_match' },
      ],
      matchedDescriptionTokens: [
        { text: 'Establishment of', isMatched: false, type: 'unique_matched' },
        { text: 'Panchayat Skill &', isMatched: false, type: 'unique_matched' },
        { text: 'Community Resource Hall at', isMatched: true, type: 'identical' },
        { text: 'Village Rampur Kalan,', isMatched: true, type: 'identical' },
        { text: 'Varanasi.', isMatched: true, type: 'identical' },
        { text: 'Scope includes multipurpose hall,', isMatched: true, type: 'near_match' },
        { text: 'solar power setup, and public digital access counter.', isMatched: true, type: 'near_match' },
      ],
      riskObservations: [
        'High semantic similarity (91.4%) between current DPR description and previously sanctioned asset.',
        'Physical distance of only 280 metres between designated coordinates in the same revenue village.',
        'Sanctioned only 330 days apart under the identical Implementing Agency (RES Division II).',
        'Potential risk of duplicate billing or overlapping asset construction on contiguous public land plots.',
      ],
    },
    geospatial: {
      latitude: 25.3198,
      longitude: 82.9762,
      geoAccuracyMeters: 4.8,
      geoSource: 'MOBILE_APP_ON_SITE',
      nearestPeerWorksCountWithin500m: 3,
      clusterAnomalyDetected: true,
      satelliteClearanceScore: 42,
      cadastralLandId: 'UP-VNS-KSH-892-RMP',
      landStatusNote: 'Overlaps with existing Gram Sabha community asset reservation boundary.',
    },
    agencyRisk: {
      agencyName: 'Rural Engineering Services (RES) Division II, Varanasi',
      contractorName: 'M/s Purvanchal Rural Infra & Development Corp',
      activeProjectsInBlockCount: 14,
      totalWorksSanctionedCount: 42,
      flaggedProjectsCount: 8,
      allocationSharePercentInBlock: 68.4,
      averageExecutionDelayDays: 148,
      utilizationCertificatesPendingCount: 11,
      riskRating: 'HIGH',
    },
  },
  timeline: [
    {
      stepId: 'TL-01',
      stageKey: 'RECOMMENDATION',
      title: 'MP Recommendation',
      subtitle: 'Formal proposal submitted via MPLADS Portal',
      status: 'COMPLETED',
      plannedDate: '2023-08-10',
      actualDate: '2023-08-14',
      elapsedDays: 4,
      standardSlaDays: 15,
      deltaDays: -11,
      disbursedPercentCumulative: 0,
      physicalProgressPercentCumulative: 0,
      isAnomalous: false,
      logs: [
        {
          date: '2023-08-14 11:20 IST',
          event: 'Proposal uploaded and verified on e-SAKSHI portal',
          recordedBy: 'Nodal Officer (DRDA Varanasi)',
          severity: 'INFO',
        },
      ],
    },
    {
      stepId: 'TL-02',
      stageKey: 'SANCTION',
      title: 'Administrative & Technical Sanction',
      subtitle: 'DPR Approval & Sanction Order Issued',
      status: 'COMPLETED',
      plannedDate: '2023-09-30',
      actualDate: '2023-10-14',
      elapsedDays: 61,
      standardSlaDays: 45,
      deltaDays: 16,
      disbursedPercentCumulative: 0,
      physicalProgressPercentCumulative: 0,
      isAnomalous: false,
      logs: [
        {
          date: '2023-10-14 16:45 IST',
          event: 'Administrative Sanction issued for ₹84,50,000 via Order #MPLADS/VNS/2023-24/PW-892/SOC',
          recordedBy: 'District Magistrate / Collector Office',
          severity: 'INFO',
        },
      ],
    },
    {
      stepId: 'TL-03',
      stageKey: 'FUND_RELEASE',
      title: 'Fund Release to Implementing Agency',
      subtitle: 'Full 100% tranche released upfront',
      status: 'ANOMALOUS',
      plannedDate: '2023-11-15',
      actualDate: '2023-11-28',
      elapsedDays: 45,
      standardSlaDays: 30,
      deltaDays: 15,
      disbursedPercentCumulative: 100,
      physicalProgressPercentCumulative: 0,
      isAnomalous: true,
      anomalyTitle: '100% Upfront Fund Release Violation',
      anomalyDescription:
        'Complete sanctioned grant of ₹84.50L was disbursed in a single tranche before milestone verification, in contravention of standard 50-40-10 staggered release guidelines.',
      logs: [
        {
          date: '2023-11-28 14:10 IST',
          event: 'Treasury voucher issued for full sanctioned amount ₹84,50,000',
          recordedBy: 'Chief Accounts Officer (DRDA)',
          severity: 'WARNING',
        },
      ],
    },
    {
      stepId: 'TL-04',
      stageKey: 'EXECUTION',
      title: 'Physical Ground Execution',
      subtitle: 'Substructure & Foundation Stage',
      status: 'ANOMALOUS',
      plannedDate: '2024-04-30',
      actualDate: null,
      elapsedDays: 380,
      standardSlaDays: 180,
      deltaDays: 200,
      disbursedPercentCumulative: 100,
      physicalProgressPercentCumulative: 12,
      isAnomalous: true,
      anomalyTitle: 'Critical Fund-to-Execution Inversion Gap (+88%)',
      anomalyDescription:
        '380 days elapsed since fund release. 100% funds drawn from treasury, but physical ground audit verifies only 12% foundation work complete. 3 mandatory quarterly progress logs missing.',
      logs: [
        {
          date: '2024-02-10 10:00 IST',
          event: 'Initial site clearance and foundation excavation reported (12% physical progress)',
          recordedBy: 'Assistant Engineer (RES Div II)',
          severity: 'INFO',
        },
        {
          date: '2024-05-15 00:00 IST',
          event: 'Q1 Physical Progress Report OVERDUE - No geo-tagged photos submitted',
          recordedBy: 'NIREEKSHAK Automated Sentry',
          severity: 'CRITICAL',
        },
        {
          date: '2024-08-20 00:00 IST',
          event: 'Q2 Physical Progress Report OVERDUE - Ground inspection flagged stalled',
          recordedBy: 'NIREEKSHAK Automated Sentry',
          severity: 'CRITICAL',
        },
      ],
    },
    {
      stepId: 'TL-05',
      stageKey: 'COMPLETION',
      title: 'Final Handover & Utilization Certificate',
      subtitle: 'Asset Inspection & UC Submission',
      status: 'DELAYED',
      plannedDate: '2024-06-30',
      actualDate: null,
      elapsedDays: 380,
      standardSlaDays: 240,
      deltaDays: 140,
      disbursedPercentCumulative: 100,
      physicalProgressPercentCumulative: 12,
      isAnomalous: true,
      anomalyTitle: 'Project Past Statutory Completion Window',
      anomalyDescription:
        'Project was scheduled for handover by June 2024. Utilization Certificate (UC) remains outstanding past the 12-month statutory limit.',
      logs: [
        {
          date: '2024-06-30 23:59 IST',
          event: 'Scheduled project completion milestone breached without extension request',
          recordedBy: 'NIREEKSHAK System',
          severity: 'WARNING',
        },
      ],
    },
  ],
  auditHistory: [
    {
      id: 'AUD-2024-8891',
      timestamp: '2024-08-20T14:15:00Z',
      officerId: 'GOI-VGL-8821',
      officerName: 'S. K. Verma, IAS',
      officerDesignation: 'District Vigilance Commissioner / Special Auditor',
      action: 'UNDER_INVESTIGATION',
      actionLabel: 'Marked Under Active Investigation',
      reviewNotes:
        'DPR cost anomalies of 2.43x and 91.4% semantic overlap with 2022 sanction (MPLADS-2023-UP54-0419) require physical geo-verification. Sub-Divisional Magistrate directed to conduct on-site inspection within 7 working days.',
      tags: ['Site Inspection Mandated', 'DPR Cost Overrun Justification Needed', 'Duplicate Asset Verification'],
    },
  ],
  verificationStatus: {
    isReviewed: true,
    currentAction: 'UNDER_INVESTIGATION',
    reviewedBy: 'S. K. Verma, IAS (District Vigilance Commissioner)',
    reviewedAt: '2024-08-20T14:15:00Z',
    reviewNotes:
      'DPR cost anomalies of 2.43x and 91.4% semantic overlap with 2022 sanction require physical geo-verification.',
    tags: ['Site Inspection Mandated', 'DPR Cost Overrun Justification Needed'],
  },
};

// Realistic mock database of projects for demo switching
export const MOCK_PROJECTS_DATABASE: Record<string, ProjectInvestigationData> = {
  'MPLADS-2024-UP54-0892': MOCK_PROJECT_INVESTIGATION_DATA,
  'MPLADS-2024-MH18-1204': {
    ...MOCK_PROJECT_INVESTIGATION_DATA,
    header: {
      ...MOCK_PROJECT_INVESTIGATION_DATA.header,
      projectId: 'MPLADS-2024-MH18-1204',
      title: 'Installation of Solar Street Lighting Units in 12 Wards of Jalgaon Municipal Area',
      sector: 'Renewable Energy & Public Lighting',
      category: 'Solar Street Lights',
      state: 'Maharashtra',
      district: 'Jalgaon',
      constituency: 'Jalgaon (MH-18)',
      sanctionedAmount: 4200000,
      releasedAmount: 4200000,
      expenditureAmount: 3800000,
      physicalProgressPercent: 45.0,
      financialProgressPercent: 90.5,
    },
    risk: {
      overallScore: 64,
      riskLevel: 'MEDIUM',
      confidenceScore: 0.88,
      flaggedRulesCount: 2,
      primaryDrivers: [
        'Cost Deviation: 1.68x above regional benchmark for LED solar luminaires',
        'Vendor Clustering: 82% of ward lighting contracts awarded to single enterprise',
      ],
      breakdown: {
        costDeviationScore: 68,
        duplicateOverlapScore: 35,
        timelineLatencyScore: 62,
        agencyConcentrationScore: 84,
      },
      summaryText:
        'Procurement costs are 1.68x above the state tender median. Vendor concentration is elevated. Requires verification of technical specifications and warranty clauses.',
    },
  },
  'MPLADS-2024-KA21-0341': {
    ...MOCK_PROJECT_INVESTIGATION_DATA,
    header: {
      ...MOCK_PROJECT_INVESTIGATION_DATA.header,
      projectId: 'MPLADS-2024-KA21-0341',
      title: 'Construction of Additional Classrooms at Government Higher Secondary School, Mangaluru',
      sector: 'Education & Skill Development',
      category: 'School Classrooms',
      state: 'Karnataka',
      district: 'Dakshina Kannada',
      constituency: 'Dakshina Kannada (KA-21)',
      sanctionedAmount: 2800000,
      releasedAmount: 2800000,
      expenditureAmount: 2750000,
      physicalProgressPercent: 95.0,
      financialProgressPercent: 98.2,
      currentStatus: 'COMPLETED',
    },
    risk: {
      overallScore: 18,
      riskLevel: 'LOW',
      confidenceScore: 0.96,
      flaggedRulesCount: 0,
      primaryDrivers: [
        'Cost metric sits within 25th-75th IQR normal percentile range (0.98x median)',
        'Zero duplicate matches within 10km radius',
        'Execution timeline aligned with scheduled SLA milestones',
      ],
      breakdown: {
        costDeviationScore: 12,
        duplicateOverlapScore: 8,
        timelineLatencyScore: 15,
        agencyConcentrationScore: 22,
      },
      summaryText:
        'Standard execution profile with normal cost parameters conforming to state PWD Schedule of Rates. No anomalous flags detected.',
    },
  },
};

/**
 * Fetch project evidence data conforming to GET /api/projects/{id}/evidence
 */
export async function fetchProjectEvidence(
  projectId: string
): Promise<ProjectInvestigationData> {
  // If running in browser and backend API is live, attempt API request
  try {
    const res = await fetch(`/api/projects/${projectId}/evidence`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (_err) {
    // Gracefully fallback to rich mock data if offline or backend is pending
  }

  // Fallback to mock data by ID or default high-risk dossier
  return MOCK_PROJECTS_DATABASE[projectId] || {
    ...MOCK_PROJECT_INVESTIGATION_DATA,
    header: {
      ...MOCK_PROJECT_INVESTIGATION_DATA.header,
      projectId: projectId || 'MPLADS-2024-UP54-0892',
    },
  };
}

/**
 * Submit official review conforming to POST /api/investigation/verify
 */
export async function submitInvestigationAction(
  payload: VerifyInvestigationRequest
): Promise<VerifyInvestigationResponse> {
  try {
    const res = await fetch('/api/investigation/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (_err) {
    // Gracefully simulate local success if backend offline
  }

  // Return realistic mock response
  return {
    success: true,
    message: `Official review decision [${payload.action}] recorded successfully into NIREEKSHAK audit trail.`,
    updatedStatus: {
      projectId: payload.projectId,
      action: payload.action,
      reviewedBy: payload.officerName || 'District Vigilance Officer',
      reviewedAt: new Date().toISOString(),
      auditLogId: `AUD-${Date.now().toString().slice(-6)}`,
    },
  };
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
