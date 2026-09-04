'use client';

import React, { useState, use } from 'react';
import {
  FileCheck,
  ArrowLeft,
  Search,
  Layers,
} from 'lucide-react';
import {
  ProjectInvestigationData,
  VerifyInvestigationResponse,
  RiskLevel,
} from '@/types/investigation';
import { formatINR } from '@/lib/sihMockData';
import AuditCaseHeader from '@/components/investigation/AuditCaseHeader';
import CostOutlierCard from '@/components/evidence/CostOutlierCard';
import DuplicateSimilarityPanel from '@/components/evidence/DuplicateSimilarityPanel';
import ExecutionTimeline from '@/components/timeline/ExecutionTimeline';
import GeospatialVerificationCard from '@/components/evidence/GeospatialVerificationCard';
import AgencyRiskCard from '@/components/evidence/AgencyRiskCard';
import ActionControls from '@/components/investigation/ActionControls';
import AuditHistoryDrawer from '@/components/investigation/AuditHistoryDrawer';

// ==========================================
// 5 JSON MOCK INVESTIGATION AUDIT CASES
// ==========================================
export const MOCK_PROJECTS: ProjectInvestigationData[] = [
  // 1. UP-1094: Varanasi Community Hall (HIGH Risk - 88)
  {
    header: {
      projectId: 'UP-1094',
      title: 'Construction of Model Community Hall & Skill Center at Rohania Block',
      sector: 'COMMUNITY INFRASTRUCTURE',
      category: 'Community Hall / Public Asset',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      constituency: 'Varanasi Lok Sabha (UP-54)',
      constituencyType: 'LOK_SABHA',
      mpName: 'Hon. Narendra Modi',
      mpHouse: 'LOK_SABHA',
      sanctionDate: '2024-02-14',
      sanctionYear: '2023-2024',
      sanctionOrderNumber: 'MPLADS/2023-24/VNS/8892-A',
      implementingAgency: 'UP State Rural Engineering Department (RED) Div-II',
      nodalDepartment: 'District Planning & Development Office, Varanasi',
      sanctionedAmount: 8450000,
      releasedAmount: 8450000,
      expenditureAmount: 8450000,
      physicalProgressPercent: 12,
      financialProgressPercent: 100,
      currentStatus: 'STALLED',
      lastUpdated: '2024-08-20',
    },
    risk: {
      overallScore: 88,
      riskLevel: 'HIGH',
      confidenceScore: 0.94,
      flaggedRulesCount: 4,
      primaryDrivers: [
        '2.15x Cost Outlier vs CPWD Schedule of Rates benchmark for built-up area (620 m²)',
        '91.4% Semantic duplicate of prior sanctioned work UP-0412 within 180m radius',
        'Severe Disbursal Inversion: 100% funds drawn vs only 12% physical progress on-site',
        'Same Implementing Agency holding 42% of active block works with 180+ days delay',
      ],
      breakdown: {
        costDeviationScore: 92,
        duplicateOverlapScore: 89,
        timelineLatencyScore: 84,
        agencyConcentrationScore: 78,
      },
      summaryText:
        'Dossier exhibits multiple compound anomalies including extreme schedule-of-rates variance and near-identical scope duplication.',
    },
    signals: [
      {
        type: 'COST_ANOMALY',
        title: 'Cost Deviation Outlier',
        severity: 'HIGH',
        scoreImpact: 35,
        description: 'Sanctioned rate of ₹13,629/m² exceeds regional baseline median by 2.15x.',
      },
      {
        type: 'DUPLICATE_WORK',
        title: 'Semantic & Spatial Duplicate Match',
        severity: 'HIGH',
        scoreImpact: 30,
        description: '91.4% verbatim DPR overlap with UP-0412 located only 180m away.',
      },
      {
        type: 'TIMELINE_VIOLATION',
        title: 'Disbursal vs Progress Inversion',
        severity: 'CRITICAL',
        scoreImpact: 25,
        description: '100% funds released at Stage 3 with only 12% verified physical progress.',
      },
      {
        type: 'GEOSPATIAL_ANOMALY',
        title: 'Cadastral Land & Cluster Flag',
        severity: 'MEDIUM',
        scoreImpact: 10,
        description: '3 other MPLADS community assets registered within 500m radius.',
      },
    ],
    evidence: {
      costOutlier: {
        thisProjectCost: 8450000,
        unitMetric: 'Built-up Area (m²)',
        unitValue: 620,
        unitCost: 13629,
        peerUnitCostMedian: 6338,
        peerMedianCost: 3930000,
        peerMeanCost: 4120000,
        peerIqrLow: 2850000,
        peerIqrHigh: 4200000,
        peerP95: 5100000,
        peerMin: 1800000,
        peerMax: 8450000,
        deviationMultiplier: 2.15,
        zScore: 3.42,
        peerSampleSize: 84,
        baselineCategory: 'Standard RCC Community Centre (Single-Storey)',
        districtMedian: 3850000,
        stateMedian: 4100000,
        costBreakdown: [
          { component: 'Earthwork & Foundation (Pile/Raft)', projectCost: 1850000, peerAverageCost: 650000, deviationPercent: 184.6, anomalyFlag: true, notes: 'SoR specifies shallow footing for non-alluvial plain terrain.' },
          { component: 'Superstructure & RCC Framing', projectCost: 3400000, peerAverageCost: 1750000, deviationPercent: 94.3, anomalyFlag: true, notes: 'M25 concrete rate invoiced 78% above CPWD DSR rate chart.' },
          { component: 'Finishing, Flooring & Joinery', projectCost: 1950000, peerAverageCost: 980000, deviationPercent: 98.9, anomalyFlag: true, notes: 'Premium vitrified tiling charged on standard rural community hall.' },
          { component: 'Electrification & Solar Setup', projectCost: 1250000, peerAverageCost: 740000, deviationPercent: 68.9, anomalyFlag: false, notes: 'Includes 5kVA rooftop off-grid solar inverter array.' },
        ],
        distributionCurve: [
          { percentile: 'P25 (Q1)', cost: 2850000, label: 'First Quartile' },
          { percentile: 'P50 (Median)', cost: 3930000, label: 'Regional Median' },
          { percentile: 'P75 (Q3)', cost: 4200000, label: 'Upper Quartile' },
          { percentile: 'Subject', cost: 8450000, label: 'Current Project (UP-1094)' },
        ],
        statisticalObservations: [
          'Cost per square metre (₹13,629) is 3.42 standard deviations above regional mean.',
          'Earthwork excavation estimates exceed volumetric requirements for 620 m² plinth by 185%.',
        ],
      },
      duplicateMatch: {
        matchScorePercent: 91.4,
        semanticMatchScore: 94.2,
        syntacticMatchScore: 88.6,
        matchedProjectId: 'UP-0412',
        matchedProjectTitle: 'Construction of Multi-Purpose Rural Hall at Rohania Gram Panchayat',
        matchedSanctionDate: '2022-09-15',
        matchedSanctionAmount: 4800000,
        matchedImplementingAgency: 'UP State Rural Engineering Department (RED) Div-II',
        matchedConstituency: 'Varanasi Lok Sabha (UP-54)',
        matchedDistrict: 'Varanasi',
        matchedState: 'Uttar Pradesh',
        matchedLocationName: 'Rohania Gram Panchayat Plot #84, Varanasi',
        matchedGpsCoords: { lat: 25.268512, lng: 82.93412 },
        currentGpsCoords: { lat: 25.269145, lng: 82.93521 },
        distanceMeters: 180,
        timeDeltaDays: 517,
        isSameImplementingAgency: true,
        matchedPhrases: [
          'construction of multi-purpose community hall with RCC framing and toilet block',
          'provision of vitrified tile flooring, aluminium sliding windows and concealed conduit wiring',
        ],
        currentDescriptionTokens: [
          { text: 'Construction', isMatched: true },
          { text: 'of', isMatched: true },
          { text: 'Model', isMatched: false },
          { text: 'Community', isMatched: true },
          { text: 'Hall', isMatched: true },
        ],
        matchedDescriptionTokens: [
          { text: 'Construction', isMatched: true },
          { text: 'of', isMatched: true },
          { text: 'Multi-Purpose', isMatched: false },
          { text: 'Community', isMatched: true },
        ],
        riskObservations: [
          'Both projects sanctioned under same implementing agency within 180m of each other.',
          'DPR bill of quantities shows 91.4% verbatim syntactic identity.',
        ],
      },
      geospatial: {
        latitude: 25.269145,
        longitude: 82.93521,
        geoAccuracyMeters: 4.2,
        geoSource: 'MOBILE_APP_ON_SITE',
        nearestPeerWorksCountWithin500m: 3,
        clusterAnomalyDetected: true,
        satelliteClearanceScore: 48,
        cadastralLandId: 'KHATA-8812 / PLOT-94-B',
        landStatusNote: 'Government Gram Sabha Land (Non-encumbered)',
      },
      agencyRisk: {
        agencyName: 'UP State Rural Engineering Department (RED) Div-II',
        contractorName: 'M/s Purvanchal Buildcon & Infra Pvt. Ltd.',
        activeProjectsInBlockCount: 14,
        totalWorksSanctionedCount: 38,
        flaggedProjectsCount: 7,
        allocationSharePercentInBlock: 42.5,
        averageExecutionDelayDays: 184,
        utilizationCertificatesPendingCount: 9,
        riskRating: 'HIGH',
      },
    },
    timeline: [
      { stepId: 'TL-01', stageKey: 'RECOMMENDATION', title: 'MP Recommendation', subtitle: 'Official MP letter submitted', status: 'COMPLETED', plannedDate: '2023-11-10', actualDate: '2023-11-10', elapsedDays: 0, standardSlaDays: 15, deltaDays: 0, disbursedPercentCumulative: 0, physicalProgressPercentCumulative: 0, isAnomalous: false, logs: [] },
      { stepId: 'TL-02', stageKey: 'SANCTION', title: 'Administrative Sanction', subtitle: 'Technical approval issued', status: 'COMPLETED', plannedDate: '2023-12-05', actualDate: '2024-02-14', elapsedDays: 71, standardSlaDays: 45, deltaDays: 26, disbursedPercentCumulative: 0, physicalProgressPercentCumulative: 0, isAnomalous: false, logs: [] },
      { stepId: 'TL-03', stageKey: 'FUND_RELEASE', title: '100% Fund Drawal', subtitle: 'Full treasury release prior to foundation', status: 'ANOMALOUS', plannedDate: '2024-03-01', actualDate: '2024-03-12', elapsedDays: 11, standardSlaDays: 30, deltaDays: 0, disbursedPercentCumulative: 100, physicalProgressPercentCumulative: 0, isAnomalous: true, anomalyTitle: 'Statutory Guideline Breach', anomalyDescription: '100% funds released in single tranche.', logs: [] },
      { stepId: 'TL-04', stageKey: 'EXECUTION', title: 'Ground Execution', subtitle: 'Civil construction', status: 'DELAYED', plannedDate: '2024-07-30', actualDate: null, elapsedDays: 161, standardSlaDays: 90, deltaDays: 71, disbursedPercentCumulative: 100, physicalProgressPercentCumulative: 12, isAnomalous: true, anomalyTitle: 'Work Inversion', anomalyDescription: 'Site work stalled at foundation stage.', logs: [] },
      { stepId: 'TL-05', stageKey: 'COMPLETION', title: 'Completion & UC', subtitle: 'Final audit certificate', status: 'PENDING', plannedDate: '2024-09-30', actualDate: null, elapsedDays: 0, standardSlaDays: 180, deltaDays: 0, disbursedPercentCumulative: 100, physicalProgressPercentCumulative: 12, isAnomalous: false, logs: [] },
    ],
    auditHistory: [
      {
        id: 'LOG-881',
        timestamp: '2024-08-18T11:30:00Z',
        officerId: 'GOI-VGL-8821',
        officerName: 'S. K. Verma, IAS',
        officerDesignation: 'District Vigilance Commissioner',
        action: 'UNDER_INVESTIGATION',
        actionLabel: 'Under Investigation',
        reviewNotes: 'Flagged for joint physical inspection due to 2.15x cost outlier and duplicate proximity.',
        tags: ['Physical Site Inspection Mandated', 'DPR Rate Overrun Justification Needed'],
      },
    ],
    verificationStatus: {
      isReviewed: true,
      currentAction: 'UNDER_INVESTIGATION',
      reviewedBy: 'S. K. Verma, IAS',
      reviewedAt: '2024-08-18T11:30:00Z',
      reviewNotes: 'Joint physical survey pending.',
      tags: ['Physical Site Inspection Mandated', 'DPR Rate Overrun Justification Needed'],
    },
  },

  // 2. MH-3312: Jalgaon Solar Lighting (HIGH Risk - 64)
  {
    header: {
      projectId: 'MH-3312',
      title: 'Installation of High-Mast Solar LED Street Lighting Network across 18 Villages',
      sector: 'RURAL ELECTRIFICATION',
      category: 'Solar Power / Public Lighting',
      state: 'Maharashtra',
      district: 'Jalgaon',
      constituency: 'Jalgaon Lok Sabha (MH-18)',
      constituencyType: 'LOK_SABHA',
      mpName: 'Hon. Unmesh Patil',
      mpHouse: 'LOK_SABHA',
      sanctionDate: '2024-01-10',
      sanctionYear: '2023-2024',
      sanctionOrderNumber: 'MPLADS/2023-24/JLG/3312-S',
      implementingAgency: 'Maharashtra State Electricity Distribution Co. Ltd (MSEDCL)',
      nodalDepartment: 'Zilla Parishad Rural Development Cell, Jalgaon',
      sanctionedAmount: 5200000,
      releasedAmount: 4160000,
      expenditureAmount: 3800000,
      physicalProgressPercent: 45,
      financialProgressPercent: 80,
      currentStatus: 'UNDER_EXECUTION',
      lastUpdated: '2024-08-14',
    },
    risk: {
      overallScore: 64,
      riskLevel: 'HIGH',
      confidenceScore: 0.88,
      flaggedRulesCount: 3,
      primaryDrivers: [
        'Single contractor concentration: M/s Urja Tech holds 68% of all block solar tenders',
        'Unit cost of ₹86,666 per high-mast light is 1.48x higher than MEDA benchmark rates',
        'Delayed milestone progression: 85 days overdue against statutory execution SLA',
      ],
      breakdown: {
        costDeviationScore: 62,
        duplicateOverlapScore: 28,
        timelineLatencyScore: 74,
        agencyConcentrationScore: 89,
      },
      summaryText:
        'Contractor concentration risk combined with uncalibrated luminary unit rates across 18 gram panchayats.',
    },
    signals: [
      {
        type: 'COST_ANOMALY',
        title: 'Luminary Rate Deviation',
        severity: 'HIGH',
        scoreImpact: 30,
        description: 'Unit cost per 120W solar mast exceeds MEDA statutory rate by 1.48x.',
      },
      {
        type: 'AGENCY_CONCENTRATION',
        title: 'Single Vendor Monopolization',
        severity: 'HIGH',
        scoreImpact: 25,
        description: '68% of taluka solar lighting works allocated to single enterprise.',
      },
      {
        type: 'TIMELINE_VIOLATION',
        title: 'Milestone Execution Delay',
        severity: 'MEDIUM',
        scoreImpact: 15,
        description: 'Overdue by 85 days beyond standard 120-day installation SLA.',
      },
    ],
    evidence: {
      costOutlier: {
        thisProjectCost: 5200000,
        unitMetric: 'Solar Mast Unit',
        unitValue: 60,
        unitCost: 86666,
        peerUnitCostMedian: 58500,
        peerMedianCost: 3510000,
        peerMeanCost: 3680000,
        peerIqrLow: 3100000,
        peerIqrHigh: 3900000,
        peerP95: 4400000,
        peerMin: 2200000,
        peerMax: 5200000,
        deviationMultiplier: 1.48,
        zScore: 2.18,
        peerSampleSize: 52,
        baselineCategory: 'Standard 120W High-Mast Solar Light with LiFePO4 Battery',
        districtMedian: 3450000,
        stateMedian: 3600000,
        costBreakdown: [
          { component: '60x 120W LED Luminaries with Solar Panels', projectCost: 3100000, peerAverageCost: 2150000, deviationPercent: 44.1, anomalyFlag: true, notes: 'Includes premium 5-yr AMC' },
          { component: 'Octagonal Poles (9m galvanized steel)', projectCost: 1400000, peerAverageCost: 950000, deviationPercent: 47.3, anomalyFlag: true, notes: 'Galvanization gauge rate exceeds baseline' },
        ],
        distributionCurve: [
          { percentile: 'P25 (Q1)', cost: 3100000, label: 'First Quartile' },
          { percentile: 'P50 (Median)', cost: 3510000, label: 'State Median' },
          { percentile: 'P75 (Q3)', cost: 3900000, label: 'Third Quartile' },
          { percentile: 'Subject', cost: 5200000, label: 'MH-3312' },
        ],
        statisticalObservations: [
          'Tender rates are 48% higher than comparable works in adjacent Dhule district.',
        ],
      },
      duplicateMatch: {
        matchScorePercent: 24.1,
        semanticMatchScore: 26.5,
        syntacticMatchScore: 21.7,
        matchedProjectId: 'MH-1804',
        matchedProjectTitle: 'Installation of Solar Lights in Jamner Block',
        matchedSanctionDate: '2023-04-10',
        matchedSanctionAmount: 3200000,
        matchedImplementingAgency: 'MSEDCL Jalgaon',
        matchedConstituency: 'Jalgaon Lok Sabha (MH-18)',
        matchedDistrict: 'Jalgaon',
        matchedState: 'Maharashtra',
        matchedLocationName: 'Jamner Taluka',
        matchedGpsCoords: { lat: 20.912, lng: 75.641 },
        currentGpsCoords: { lat: 20.985, lng: 75.568 },
        distanceMeters: 9200,
        timeDeltaDays: 275,
        isSameImplementingAgency: true,
        matchedPhrases: ['installation of high mast solar led lights'],
        currentDescriptionTokens: [{ text: 'Solar', isMatched: true }, { text: 'LED', isMatched: true }],
        matchedDescriptionTokens: [{ text: 'Solar', isMatched: true }],
        riskObservations: ['Low duplicate overlap; primarily a rate and vendor concentration anomaly.'],
      },
      geospatial: {
        latitude: 20.985,
        longitude: 75.568,
        geoAccuracyMeters: 6.8,
        geoSource: 'SURVEYOR_DPR',
        nearestPeerWorksCountWithin500m: 0,
        clusterAnomalyDetected: false,
        satelliteClearanceScore: 82,
        cadastralLandId: 'PANCHAYAT-STREET-NET-18',
        landStatusNote: 'Public Gram Panchayat Roadways',
      },
      agencyRisk: {
        agencyName: 'Maharashtra State Electricity Distribution Co. Ltd (MSEDCL)',
        contractorName: 'M/s Urja Tech Power Systems Pvt Ltd',
        activeProjectsInBlockCount: 9,
        totalWorksSanctionedCount: 22,
        flaggedProjectsCount: 4,
        allocationSharePercentInBlock: 68.2,
        averageExecutionDelayDays: 85,
        utilizationCertificatesPendingCount: 5,
        riskRating: 'ELEVATED',
      },
    },
    timeline: [
      { stepId: 'TL-01', stageKey: 'RECOMMENDATION', title: 'Recommendation', subtitle: 'Letter from Hon. MP', status: 'COMPLETED', plannedDate: '2023-11-05', actualDate: '2023-11-05', elapsedDays: 0, standardSlaDays: 15, deltaDays: 0, disbursedPercentCumulative: 0, physicalProgressPercentCumulative: 0, isAnomalous: false, logs: [] },
      { stepId: 'TL-02', stageKey: 'SANCTION', title: 'Sanction Order', subtitle: 'MEDA clearance', status: 'COMPLETED', plannedDate: '2023-12-15', actualDate: '2024-01-10', elapsedDays: 26, standardSlaDays: 30, deltaDays: 0, disbursedPercentCumulative: 0, physicalProgressPercentCumulative: 0, isAnomalous: false, logs: [] },
      { stepId: 'TL-03', stageKey: 'FUND_RELEASE', title: 'Advance Disbursal', subtitle: '80% release', status: 'COMPLETED', plannedDate: '2024-02-01', actualDate: '2024-02-15', elapsedDays: 14, standardSlaDays: 20, deltaDays: 0, disbursedPercentCumulative: 80, physicalProgressPercentCumulative: 0, isAnomalous: false, logs: [] },
      { stepId: 'TL-04', stageKey: 'EXECUTION', title: 'Ground Erection', subtitle: 'Installation of solar masts', status: 'DELAYED', plannedDate: '2024-05-30', actualDate: null, elapsedDays: 85, standardSlaDays: 90, deltaDays: 45, disbursedPercentCumulative: 80, physicalProgressPercentCumulative: 45, isAnomalous: false, logs: [] },
      { stepId: 'TL-05', stageKey: 'COMPLETION', title: 'Final Inspection', subtitle: 'Audit pending', status: 'PENDING', plannedDate: '2024-09-30', actualDate: null, elapsedDays: 0, standardSlaDays: 120, deltaDays: 0, disbursedPercentCumulative: 80, physicalProgressPercentCumulative: 45, isAnomalous: false, logs: [] },
    ],
    auditHistory: [],
    verificationStatus: { isReviewed: false, currentAction: null },
  },

  // 3. KL-5501: Wayanad STEM Lab (CRITICAL Risk - 94)
  {
    header: {
      projectId: 'KL-5501',
      title: 'Establishment of Advanced STEM Digital Innovation Lab & Smart Classrooms',
      sector: 'EDUCATION & SKILLING',
      category: 'Smart School / Digital Infrastructure',
      state: 'Kerala',
      district: 'Wayanad',
      constituency: 'Wayanad Lok Sabha (KL-04)',
      constituencyType: 'LOK_SABHA',
      mpName: 'Hon. Rahul Gandhi',
      mpHouse: 'LOK_SABHA',
      sanctionDate: '2024-03-01',
      sanctionYear: '2023-2024',
      sanctionOrderNumber: 'MPLADS/2023-24/WYD/5501-EDU',
      implementingAgency: 'Kerala State IT Infrastructure Ltd (KSITIL)',
      nodalDepartment: 'District Education Office, Wayanad',
      sanctionedAmount: 9600000,
      releasedAmount: 9600000,
      expenditureAmount: 9600000,
      physicalProgressPercent: 5,
      financialProgressPercent: 100,
      currentStatus: 'STALLED',
      lastUpdated: '2024-08-22',
    },
    risk: {
      overallScore: 94,
      riskLevel: 'CRITICAL',
      confidenceScore: 0.96,
      flaggedRulesCount: 4,
      primaryDrivers: [
        '96.8% duplicate of KITE state-funded lab scheme already completed on same campus',
        'Full 100% funds drawn within 4 days of sanction with 0 computer terminals delivered',
        'Non-existent hardware serial numbers cited in initial delivery challan',
        'Severe 2.85x price inflation on generic 65-inch Interactive Flat Panels (IFP)',
      ],
      breakdown: {
        costDeviationScore: 96,
        duplicateOverlapScore: 98,
        timelineLatencyScore: 92,
        agencyConcentrationScore: 84,
      },
      summaryText:
        'Critical duplicate asset flag indicating MPLADS funds sanctioned for school infrastructure already fully funded by KITE state project.',
    },
    signals: [
      {
        type: 'DUPLICATE_WORK',
        title: 'Identical Scheme Double-Funding',
        severity: 'CRITICAL',
        scoreImpact: 40,
        description: '96.8% identical scope to completed KITE Lab project KL-2023-SCH-112.',
      },
      {
        type: 'TIMELINE_VIOLATION',
        title: 'Instant Tranche Drawal Without Delivery',
        severity: 'CRITICAL',
        scoreImpact: 30,
        description: '100% disbursement in 4 days with only 5% site preparation done.',
      },
      {
        type: 'COST_ANOMALY',
        title: 'Extreme Electronics Rate Markup',
        severity: 'HIGH',
        scoreImpact: 25,
        description: 'Smartboards and workstations priced 2.85x above GeM rate contracts.',
      },
    ],
    evidence: {
      costOutlier: {
        thisProjectCost: 9600000,
        unitMetric: 'Per Lab Classroom Unit',
        unitValue: 8,
        unitCost: 1200000,
        peerUnitCostMedian: 420000,
        peerMedianCost: 3360000,
        peerMeanCost: 3500000,
        peerIqrLow: 2800000,
        peerIqrHigh: 3800000,
        peerP95: 4500000,
        peerMin: 2000000,
        peerMax: 9600000,
        deviationMultiplier: 2.85,
        zScore: 4.12,
        peerSampleSize: 64,
        baselineCategory: 'Standard 40-Seat STEM Digital Classroom with 65" IFP',
        districtMedian: 3200000,
        stateMedian: 3400000,
        costBreakdown: [
          { component: '8x 65" 4K Interactive Flat Panels', projectCost: 3800000, peerAverageCost: 1200000, deviationPercent: 216.6, anomalyFlag: true, notes: 'GeM rate is ₹1.45L/unit vs ₹4.75L billed' },
          { component: '160x Student Thin Client Terminals', projectCost: 3600000, peerAverageCost: 1300000, deviationPercent: 176.9, anomalyFlag: true, notes: 'Unbranded terminals invoiced at high-end PC rates' },
        ],
        distributionCurve: [
          { percentile: 'P25 (Q1)', cost: 2800000, label: 'Q1' },
          { percentile: 'P50 (Median)', cost: 3360000, label: 'Median' },
          { percentile: 'Subject', cost: 9600000, label: 'KL-5501 (Outlier)' },
        ],
        statisticalObservations: [
          'Hardware unit costs exceed Government e-Marketplace (GeM) ceiling rates by 216%.',
        ],
      },
      duplicateMatch: {
        matchScorePercent: 96.8,
        semanticMatchScore: 98.4,
        syntacticMatchScore: 95.2,
        matchedProjectId: 'KL-KITE-2023-089',
        matchedProjectTitle: 'State KITE High-Tech Lab Implementation at Govt Higher Secondary School',
        matchedSanctionDate: '2023-01-20',
        matchedSanctionAmount: 3800000,
        matchedImplementingAgency: 'Kerala Infrastructure and Technology for Education (KITE)',
        matchedConstituency: 'Wayanad Lok Sabha (KL-04)',
        matchedDistrict: 'Wayanad',
        matchedState: 'Kerala',
        matchedLocationName: 'GHSS Mananthavady Campus',
        matchedGpsCoords: { lat: 11.8021, lng: 76.0042 },
        currentGpsCoords: { lat: 11.8022, lng: 76.0041 },
        distanceMeters: 14,
        timeDeltaDays: 406,
        isSameImplementingAgency: false,
        matchedPhrases: [
          'supply of interactive touch flat panels and n-computing virtual desktop units',
          'structured cat6 cabling and 5kva online ups power backup system',
        ],
        currentDescriptionTokens: [
          { text: 'Supply', isMatched: true },
          { text: 'Advanced', isMatched: false },
          { text: 'STEM', isMatched: true },
        ],
        matchedDescriptionTokens: [
          { text: 'Supply', isMatched: true },
          { text: 'KITE', isMatched: false },
          { text: 'STEM', isMatched: true },
        ],
        riskObservations: [
          'Same school building (GHSS Mananthavady) was already equipped with identical hardware under KITE in 2023.',
        ],
      },
      geospatial: {
        latitude: 11.8022,
        longitude: 76.0041,
        geoAccuracyMeters: 2.1,
        geoSource: 'MOBILE_APP_ON_SITE',
        nearestPeerWorksCountWithin500m: 4,
        clusterAnomalyDetected: true,
        satelliteClearanceScore: 92,
        cadastralLandId: 'MANANTHAVADY-SCH-PLOT-02',
        landStatusNote: 'State Education Department Institutional Land',
      },
      agencyRisk: {
        agencyName: 'Kerala State IT Infrastructure Ltd (KSITIL)',
        contractorName: 'M/s NeoTech Cyber Solutions LLP',
        activeProjectsInBlockCount: 5,
        totalWorksSanctionedCount: 14,
        flaggedProjectsCount: 3,
        allocationSharePercentInBlock: 55.0,
        averageExecutionDelayDays: 140,
        utilizationCertificatesPendingCount: 4,
        riskRating: 'HIGH',
      },
    },
    timeline: [
      { stepId: 'TL-01', stageKey: 'RECOMMENDATION', title: 'Recommendation', subtitle: 'MP recommendation received', status: 'COMPLETED', plannedDate: '2024-02-01', actualDate: '2024-02-01', elapsedDays: 0, standardSlaDays: 15, deltaDays: 0, disbursedPercentCumulative: 0, physicalProgressPercentCumulative: 0, isAnomalous: false, logs: [] },
      { stepId: 'TL-02', stageKey: 'SANCTION', title: 'Sanction Order', subtitle: 'Issued by District Collector', status: 'COMPLETED', plannedDate: '2024-02-20', actualDate: '2024-03-01', elapsedDays: 10, standardSlaDays: 30, deltaDays: 0, disbursedPercentCumulative: 0, physicalProgressPercentCumulative: 0, isAnomalous: false, logs: [] },
      { stepId: 'TL-03', stageKey: 'FUND_RELEASE', title: 'Instant 100% Release', subtitle: 'Full amount transferred in 4 days', status: 'ANOMALOUS', plannedDate: '2024-03-25', actualDate: '2024-03-05', elapsedDays: 4, standardSlaDays: 20, deltaDays: 0, disbursedPercentCumulative: 100, physicalProgressPercentCumulative: 0, isAnomalous: true, anomalyTitle: 'Abnormal Expedited Disbursal', anomalyDescription: '100% payment without verification.', logs: [] },
      { stepId: 'TL-04', stageKey: 'EXECUTION', title: 'Site Handover', subtitle: 'Classrooms remain empty', status: 'ANOMALOUS', plannedDate: '2024-06-30', actualDate: null, elapsedDays: 140, standardSlaDays: 60, deltaDays: 80, disbursedPercentCumulative: 100, physicalProgressPercentCumulative: 5, isAnomalous: true, anomalyTitle: 'Zero Asset Delivery', anomalyDescription: 'No hardware delivered.', logs: [] },
      { stepId: 'TL-05', stageKey: 'COMPLETION', title: 'UC Pending', subtitle: 'Statutory verification pending', status: 'PENDING', plannedDate: '2024-08-30', actualDate: null, elapsedDays: 0, standardSlaDays: 90, deltaDays: 0, disbursedPercentCumulative: 100, physicalProgressPercentCumulative: 5, isAnomalous: false, logs: [] },
    ],
    auditHistory: [],
    verificationStatus: { isReviewed: false, currentAction: null },
  },

  // 4. RJ-9921: Jodhpur Check Dam (HIGH Risk - 76)
  {
    header: {
      projectId: 'RJ-9921',
      title: 'Construction of Check Dam & Water Harvesting Percolation Bund at Osian',
      sector: 'WATER RESOURCE MANAGEMENT',
      category: 'Water Harvesting / Irrigation',
      state: 'Rajasthan',
      district: 'Jodhpur',
      constituency: 'Jodhpur Lok Sabha (RJ-13)',
      constituencyType: 'LOK_SABHA',
      mpName: 'Hon. Gajendra Singh Shekhawat',
      mpHouse: 'LOK_SABHA',
      sanctionDate: '2023-11-20',
      sanctionYear: '2023-2024',
      sanctionOrderNumber: 'MPLADS/2023-24/JDH/9921-W',
      implementingAgency: 'Rajasthan Watershed Development & Soil Conservation Dept',
      nodalDepartment: 'District Rural Development Authority (DRDA), Jodhpur',
      sanctionedAmount: 6800000,
      releasedAmount: 6800000,
      expenditureAmount: 6200000,
      physicalProgressPercent: 30,
      financialProgressPercent: 100,
      currentStatus: 'STALLED',
      lastUpdated: '2024-08-16',
    },
    risk: {
      overallScore: 76,
      riskLevel: 'HIGH',
      confidenceScore: 0.91,
      flaggedRulesCount: 3,
      primaryDrivers: [
        'Geospatial satellite verification reveals coordinates fall in sandy dune zone with 0 catchment yield',
        'Overlapping earthen masonry bund sanctioned in 2021 under MGNREGS on same catchment',
        '100% fund disbursement recorded while stone pitch masonry remains incomplete',
      ],
      breakdown: {
        costDeviationScore: 68,
        duplicateOverlapScore: 72,
        timelineLatencyScore: 81,
        agencyConcentrationScore: 65,
      },
      summaryText:
        'Severe watershed feasibility mismatch where geotagged location cannot sustain hydrological storage volume.',
    },
    signals: [
      {
        type: 'GEOSPATIAL_ANOMALY',
        title: 'Catchment Feasibility Failure',
        severity: 'HIGH',
        scoreImpact: 35,
        description: 'ISRO Bhuvan satellite imagery indicates 0 runoff potential at recorded coordinates.',
      },
      {
        type: 'COST_ANOMALY',
        title: 'Earthen Embankment Rate Deviation',
        severity: 'HIGH',
        scoreImpact: 25,
        description: 'Soil cartage and masonry rates 1.62x higher than state watershed SoR.',
      },
      {
        type: 'TIMELINE_VIOLATION',
        title: 'Premature Full Payment',
        severity: 'HIGH',
        scoreImpact: 20,
        description: '100% funds drawn before mandatory pre-monsoon spillway testing.',
      },
    ],
    evidence: {
      costOutlier: {
        thisProjectCost: 6800000,
        unitMetric: 'Per Million Litre Storage',
        unitValue: 42,
        unitCost: 161904,
        peerUnitCostMedian: 99800,
        peerMedianCost: 4191600,
        peerMeanCost: 4350000,
        peerIqrLow: 3500000,
        peerIqrHigh: 4600000,
        peerP95: 5200000,
        peerMin: 2400000,
        peerMax: 6800000,
        deviationMultiplier: 1.62,
        zScore: 2.65,
        peerSampleSize: 44,
        baselineCategory: 'Earthen Bund with Masonry Waste Weir (40ML Storage)',
        districtMedian: 4100000,
        stateMedian: 4250000,
        costBreakdown: [
          { component: 'Heavy Earth Moving & Embankment', projectCost: 3200000, peerAverageCost: 1800000, deviationPercent: 77.7, anomalyFlag: true, notes: 'Lead distance invoiced at 45km' },
          { component: 'Stone Pitching & Apron Masonry', projectCost: 2400000, peerAverageCost: 1500000, deviationPercent: 60.0, anomalyFlag: true, notes: 'Masonry rates inflated' },
        ],
        distributionCurve: [
          { percentile: 'P25 (Q1)', cost: 3500000, label: 'Q1' },
          { percentile: 'P50 (Median)', cost: 4191600, label: 'Median' },
          { percentile: 'Subject', cost: 6800000, label: 'RJ-9921' },
        ],
        statisticalObservations: [
          'Hydrological storage volume calculated on flat terrain without natural ridge line.',
        ],
      },
      duplicateMatch: {
        matchScorePercent: 62.4,
        semanticMatchScore: 68.0,
        syntacticMatchScore: 56.8,
        matchedProjectId: 'RJ-MGNREGS-2021-441',
        matchedProjectTitle: 'Construction of Percolation Tank at Osian Nadi',
        matchedSanctionDate: '2021-08-14',
        matchedSanctionAmount: 2800000,
        matchedImplementingAgency: 'Panchayat Samiti Osian',
        matchedConstituency: 'Jodhpur Lok Sabha (RJ-13)',
        matchedDistrict: 'Jodhpur',
        matchedState: 'Rajasthan',
        matchedLocationName: 'Osian Village Catchment Area',
        matchedGpsCoords: { lat: 26.7214, lng: 72.8942 },
        currentGpsCoords: { lat: 26.7221, lng: 72.8951 },
        distanceMeters: 110,
        timeDeltaDays: 828,
        isSameImplementingAgency: false,
        matchedPhrases: ['construction of earthen bund and stone pitching for water percolation'],
        currentDescriptionTokens: [{ text: 'Check', isMatched: true }, { text: 'Dam', isMatched: true }],
        matchedDescriptionTokens: [{ text: 'Percolation', isMatched: false }],
        riskObservations: ['Physical bund already existed under MGNREGS.'],
      },
      geospatial: {
        latitude: 26.7221,
        longitude: 72.8951,
        geoAccuracyMeters: 5.4,
        geoSource: 'MOBILE_APP_ON_SITE',
        nearestPeerWorksCountWithin500m: 1,
        clusterAnomalyDetected: true,
        satelliteClearanceScore: 34,
        cadastralLandId: 'KHASRA-402 / CHARAGAH',
        landStatusNote: 'Common Village Pasture Land (Charagah)',
      },
      agencyRisk: {
        agencyName: 'Rajasthan Watershed Development Dept',
        contractorName: 'M/s Thar Civil Infrastructure Ltd',
        activeProjectsInBlockCount: 6,
        totalWorksSanctionedCount: 16,
        flaggedProjectsCount: 2,
        allocationSharePercentInBlock: 37.5,
        averageExecutionDelayDays: 115,
        utilizationCertificatesPendingCount: 3,
        riskRating: 'MODERATE',
      },
    },
    timeline: [
      { stepId: 'TL-01', stageKey: 'RECOMMENDATION', title: 'Recommendation', subtitle: 'Submitted by MP', status: 'COMPLETED', plannedDate: '2023-09-10', actualDate: '2023-09-10', elapsedDays: 0, standardSlaDays: 15, deltaDays: 0, disbursedPercentCumulative: 0, physicalProgressPercentCumulative: 0, isAnomalous: false, logs: [] },
      { stepId: 'TL-02', stageKey: 'SANCTION', title: 'Sanction Order', subtitle: 'Technical clearance', status: 'COMPLETED', plannedDate: '2023-10-30', actualDate: '2023-11-20', elapsedDays: 21, standardSlaDays: 30, deltaDays: 0, disbursedPercentCumulative: 0, physicalProgressPercentCumulative: 0, isAnomalous: false, logs: [] },
      { stepId: 'TL-03', stageKey: 'FUND_RELEASE', title: 'Fund Release', subtitle: '100% drawn', status: 'COMPLETED', plannedDate: '2023-12-15', actualDate: '2024-01-05', elapsedDays: 20, standardSlaDays: 20, deltaDays: 0, disbursedPercentCumulative: 100, physicalProgressPercentCumulative: 0, isAnomalous: false, logs: [] },
      { stepId: 'TL-04', stageKey: 'EXECUTION', title: 'Earthwork & Masonry', subtitle: 'Stalled before monsoon', status: 'DELAYED', plannedDate: '2024-05-30', actualDate: null, elapsedDays: 120, standardSlaDays: 90, deltaDays: 60, disbursedPercentCumulative: 100, physicalProgressPercentCumulative: 30, isAnomalous: true, anomalyTitle: 'Unfinished Spillway', anomalyDescription: 'Waste weir unpaved.', logs: [] },
      { stepId: 'TL-05', stageKey: 'COMPLETION', title: 'Final Inspection', subtitle: 'Pending report', status: 'PENDING', plannedDate: '2024-08-30', actualDate: null, elapsedDays: 0, standardSlaDays: 120, deltaDays: 0, disbursedPercentCumulative: 100, physicalProgressPercentCumulative: 30, isAnomalous: false, logs: [] },
    ],
    auditHistory: [],
    verificationStatus: { isReviewed: false, currentAction: null },
  },

  // 5. WB-4022: Birbhum Health Center (LOW Risk - 18)
  {
    header: {
      projectId: 'WB-4022',
      title: 'Rural Primary Health Sub-Center Boundary & Water Purification Facility',
      sector: 'PUBLIC HEALTH',
      category: 'Primary Health / Drinking Water',
      state: 'West Bengal',
      district: 'Birbhum',
      constituency: 'Bolpur Lok Sabha (WB-41)',
      constituencyType: 'LOK_SABHA',
      mpName: 'Hon. Asit Kumar Mal',
      mpHouse: 'LOK_SABHA',
      sanctionDate: '2023-08-15',
      sanctionYear: '2023-2024',
      sanctionOrderNumber: 'MPLADS/2023-24/BHM/4022-H',
      implementingAgency: 'West Bengal Public Health Engineering Directorate (PHED)',
      nodalDepartment: 'District Magistrate & District Programme Coordinator, Birbhum',
      sanctionedAmount: 2400000,
      releasedAmount: 2400000,
      expenditureAmount: 2380000,
      physicalProgressPercent: 100,
      financialProgressPercent: 100,
      currentStatus: 'COMPLETED',
      lastUpdated: '2024-06-10',
    },
    risk: {
      overallScore: 18,
      riskLevel: 'LOW',
      confidenceScore: 0.98,
      flaggedRulesCount: 0,
      primaryDrivers: [
        'Cost estimates strictly match West Bengal PWD Schedule of Rates (1.02x baseline)',
        'Zero duplicate matches within 10km radius; distinct geo-coordinates verified',
        'Work completed within 140 days against 180-day SLA; UC submitted with geotagged photos',
      ],
      breakdown: {
        costDeviationScore: 14,
        duplicateOverlapScore: 12,
        timelineLatencyScore: 16,
        agencyConcentrationScore: 22,
      },
      summaryText:
        'Standard conforming project with complete physical delivery, on-time milestones, and zero forensic red flags.',
    },
    signals: [
      {
        type: 'COST_ANOMALY',
        title: 'Standard Baseline Conformance',
        severity: 'LOW',
        scoreImpact: 5,
        description: 'Sanctioned rate conforms precisely to state PWD Schedule of Rates (1.02x).',
      },
    ],
    evidence: {
      costOutlier: {
        thisProjectCost: 2400000,
        unitMetric: 'Built Boundary & Plant (m)',
        unitValue: 280,
        unitCost: 8571,
        peerUnitCostMedian: 8400,
        peerMedianCost: 2352000,
        peerMeanCost: 2380000,
        peerIqrLow: 2100000,
        peerIqrHigh: 2600000,
        peerP95: 2900000,
        peerMin: 1800000,
        peerMax: 3200000,
        deviationMultiplier: 1.02,
        zScore: 0.18,
        peerSampleSize: 78,
        baselineCategory: 'Standard Brick Boundary Wall (280m) + RO-UV Plant',
        districtMedian: 2350000,
        stateMedian: 2400000,
        costBreakdown: [
          { component: 'Brickwork Boundary Wall with MS Gates (280m)', projectCost: 1550000, peerAverageCost: 1520000, deviationPercent: 2.0, anomalyFlag: false, notes: 'Exact match with PWD SoR' },
          { component: 'Commercial RO-UV Filtration Plant (500 LPH)', projectCost: 550000, peerAverageCost: 540000, deviationPercent: 1.8, anomalyFlag: false, notes: 'Procured via GeM' },
        ],
        distributionCurve: [
          { percentile: 'P25 (Q1)', cost: 2100000, label: 'Q1' },
          { percentile: 'P50 (Median)', cost: 2352000, label: 'Median' },
          { percentile: 'Subject', cost: 2400000, label: 'WB-4022 (Normal)' },
        ],
        statisticalObservations: [
          'All itemized work components are within 3.5% of regional baseline median.',
        ],
      },
      duplicateMatch: {
        matchScorePercent: 12.2,
        semanticMatchScore: 14.0,
        syntacticMatchScore: 10.4,
        matchedProjectId: 'WB-PHED-2022-118',
        matchedProjectTitle: 'Community Tube-Well Installation at Labpur',
        matchedSanctionDate: '2022-04-10',
        matchedSanctionAmount: 650000,
        matchedImplementingAgency: 'PHED Birbhum',
        matchedConstituency: 'Bolpur Lok Sabha (WB-41)',
        matchedDistrict: 'Birbhum',
        matchedState: 'West Bengal',
        matchedLocationName: 'Labpur Block',
        matchedGpsCoords: { lat: 23.834, lng: 87.821 },
        currentGpsCoords: { lat: 23.668, lng: 87.695 },
        distanceMeters: 24500,
        timeDeltaDays: 492,
        isSameImplementingAgency: true,
        matchedPhrases: [],
        currentDescriptionTokens: [{ text: 'Health', isMatched: false }],
        matchedDescriptionTokens: [],
        riskObservations: ['No duplicate overlap detected. Genuine discrete public healthcare asset.'],
      },
      geospatial: {
        latitude: 23.668,
        longitude: 87.695,
        geoAccuracyMeters: 2.8,
        geoSource: 'MOBILE_APP_ON_SITE',
        nearestPeerWorksCountWithin500m: 0,
        clusterAnomalyDetected: false,
        satelliteClearanceScore: 98,
        cadastralLandId: 'ILLAMBAZAR-PHC-PLOT-14',
        landStatusNote: 'Government Health Department Enclosure',
      },
      agencyRisk: {
        agencyName: 'West Bengal Public Health Engineering Directorate (PHED)',
        contractorName: 'M/s Bengal Civil Infra Ltd',
        activeProjectsInBlockCount: 3,
        totalWorksSanctionedCount: 28,
        flaggedProjectsCount: 0,
        allocationSharePercentInBlock: 18.0,
        averageExecutionDelayDays: 0,
        utilizationCertificatesPendingCount: 0,
        riskRating: 'LOW',
      },
    },
    timeline: [
      { stepId: 'TL-01', stageKey: 'RECOMMENDATION', title: 'Recommendation', subtitle: 'Letter from Hon. MP', status: 'COMPLETED', plannedDate: '2023-07-01', actualDate: '2023-07-01', elapsedDays: 0, standardSlaDays: 15, deltaDays: 0, disbursedPercentCumulative: 0, physicalProgressPercentCumulative: 0, isAnomalous: false, logs: [] },
      { stepId: 'TL-02', stageKey: 'SANCTION', title: 'Sanction Order', subtitle: 'Administrative Sanction', status: 'COMPLETED', plannedDate: '2023-08-01', actualDate: '2023-08-15', elapsedDays: 14, standardSlaDays: 30, deltaDays: 0, disbursedPercentCumulative: 0, physicalProgressPercentCumulative: 0, isAnomalous: false, logs: [] },
      { stepId: 'TL-03', stageKey: 'FUND_RELEASE', title: 'Tranche Disbursal', subtitle: 'Milestone 1 release', status: 'COMPLETED', plannedDate: '2023-09-01', actualDate: '2023-09-05', elapsedDays: 4, standardSlaDays: 20, deltaDays: 0, disbursedPercentCumulative: 50, physicalProgressPercentCumulative: 0, isAnomalous: false, logs: [] },
      { stepId: 'TL-04', stageKey: 'EXECUTION', title: 'Civil Works', subtitle: 'Erection completed', status: 'COMPLETED', plannedDate: '2023-12-30', actualDate: '2023-12-20', elapsedDays: 106, standardSlaDays: 120, deltaDays: -10, disbursedPercentCumulative: 100, physicalProgressPercentCumulative: 100, isAnomalous: false, logs: [] },
      { stepId: 'TL-05', stageKey: 'COMPLETION', title: 'UC Verified', subtitle: 'Operational', status: 'COMPLETED', plannedDate: '2024-02-15', actualDate: '2024-01-28', elapsedDays: 39, standardSlaDays: 60, deltaDays: -18, disbursedPercentCumulative: 100, physicalProgressPercentCumulative: 100, isAnomalous: false, logs: [] },
    ],
    auditHistory: [
      {
        id: 'LOG-402',
        timestamp: '2024-02-05T10:00:00Z',
        officerId: 'GOI-VGL-4412',
        officerName: 'P. K. Banerjee, WBCS',
        officerDesignation: 'District Audit Officer, Birbhum',
        action: 'DISMISS_CLEAR',
        actionLabel: 'Dismiss / Verified Clear',
        reviewNotes: 'Physical ground verification completed. Project fully executed within SoR limits with active water supply.',
        tags: ['Valid Topography / Terrestrial Allowance'],
      },
    ],
    verificationStatus: {
      isReviewed: true,
      currentAction: 'DISMISS_CLEAR',
      reviewedBy: 'P. K. Banerjee, WBCS',
      reviewedAt: '2024-02-05T10:00:00Z',
      reviewNotes: 'Verified clear on site.',
      tags: ['Valid Topography / Terrestrial Allowance'],
    },
  },
];

interface PageProps {
  params: Promise<{
    projectId: string;
  }> | {
    projectId: string;
  };
}

export default function ProjectInvestigationPage({ params }: PageProps) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const urlProjectId = resolvedParams?.projectId ? decodeURIComponent(resolvedParams.projectId) : 'UP-1094';

  const [activeProject, setActiveProject] = useState<ProjectInvestigationData | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch(`/api/projects/${urlProjectId}/investigation?_t=${Date.now()}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setActiveProject(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [urlProjectId]);

  const [activeTab, setActiveTab] = useState<'all' | 'cost' | 'duplicates' | 'timeline' | 'geo'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-400 border-red-900 bg-red-950/40';
      case 'HIGH':
        return 'text-amber-400 border-amber-900/60 bg-amber-950/30';
      case 'MEDIUM':
        return 'text-amber-400 border-amber-900/40 bg-amber-950/20';
      case 'LOW':
      default:
        return 'text-emerald-400 border-emerald-900 bg-emerald-950/40';
    }
  };

  const handleActionComplete = (response: VerifyInvestigationResponse) => {
    const newEntry = {
      id: response.updatedStatus.auditLogId,
      timestamp: response.updatedStatus.reviewedAt,
      officerId: 'GOI-VGL-8821',
      officerName: response.updatedStatus.reviewedBy,
      officerDesignation: 'District Vigilance Commissioner & Chief Audit Officer',
      action: response.updatedStatus.action,
      actionLabel: response.updatedStatus.action.replace(/_/g, ' '),
      reviewNotes: 'Determination successfully registered in statutory audit log.',
      tags: ['Updated Decision', 'Official Verification Complete'],
    };

    const updated = {
      ...activeProject,
      verificationStatus: {
        isReviewed: true,
        currentAction: response.updatedStatus.action,
        reviewedBy: response.updatedStatus.reviewedBy,
        reviewedAt: response.updatedStatus.reviewedAt,
      },
      auditHistory: [newEntry, ...(activeProject?.auditHistory || [])],
    };

    setActiveProject(updated as ProjectInvestigationData);
    setToastMessage(`Decision [${response.updatedStatus.action}] successfully logged for ${activeProject?.header?.projectId || ''}.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0b1016] text-white flex items-center justify-center">Loading dossier...</div>;
  }

  if (!activeProject) {
    return <div className="min-h-screen bg-[#0b1016] text-white flex items-center justify-center">Project not found</div>;
  }

  // Derived metrics or specific sections (safe to access since activeProject exists)
  const isDuplicateMatchCritical =
    activeProject.evidence.duplicateMatch &&
    activeProject.evidence.duplicateMatch.matchScorePercent >= 85;

  const filteredQueue = MOCK_PROJECTS.filter(
    (p) =>
      p.header.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.header.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.header.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { header, risk, evidence, timeline, auditHistory, verificationStatus, signals } = activeProject;

  return (
    <main className="min-h-screen bg-[#0b1016] text-white">
      {/* Top Header matching Member 4 */}
      <header className="border-b border-slate-800 bg-[#0b1016] w-full">
          <div className="max-w-screen-2xl mx-auto px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <a href="/projects" className="inline-flex items-center text-sm text-slate-400 hover:text-emerald-400 transition-colors mb-4 group font-medium">
                <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
                Back to Projects
              </a>
              <p className="text-xs tracking-[0.25em] text-emerald-400 font-semibold uppercase">
                INVESTIGATION CENTRE
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white tracking-tight">
                Project Investigation
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Analyse flagged MPLADS projects and verify explainable anomaly evidence
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-left md:text-right">
                <p className="text-xs text-slate-500">ACTIVE CASE</p>
                <p className="text-sm font-mono text-emerald-400 font-semibold">{activeProject.header.projectId}</p>
              </div>
              <div className={`rounded border px-3 py-1.5 text-xs font-semibold ${getRiskColor(activeProject.risk.riskLevel)}`}>
                RISK SCORE: {activeProject.risk.overallScore} / 100
              </div>
            </div>
          </div>
        </header>

        {/* Centered Main Page Body */}
        <div className="max-w-screen-2xl mx-auto px-8 py-6 w-full space-y-8">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 rounded-lg bg-[#101720] border border-emerald-900 text-emerald-400 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileCheck className="h-4 w-4 text-emerald-400" />
                <span>{toastMessage}</span>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* Active Audit Queue Project Selector */}
          <div className="rounded-lg border border-slate-800 bg-[#101720] p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs tracking-wider text-slate-500 uppercase font-medium">
                  ACTIVE AUDIT QUEUE ({MOCK_PROJECTS.length} CASES)
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Select a flagged MPLADS case dossier to inspect forensic evidence
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={activeProject.header.projectId}
                  onChange={(e) => {
                    const found = MOCK_PROJECTS.find((p) => p.header.projectId === e.target.value);
                    if (found) {
                      setActiveProject(found);
                      setActiveTab('all');
                    }
                  }}
                  className="rounded-md border border-slate-700 bg-[#0b1016] px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500 min-w-[280px]"
                >
                  {MOCK_PROJECTS.map((project) => (
                    <option key={project.header.projectId} value={project.header.projectId}>
                      {project.header.projectId} — {project.header.title.slice(0, 32)}... ({project.risk.riskLevel} {project.risk.overallScore})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick-Jump Case Badges */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider mr-2 font-medium">QUICK JUMP:</span>
              {MOCK_PROJECTS.map((p) => {
                const isSelected = p.header.projectId === activeProject.header.projectId;
                const color = getRiskColor(p.risk.riskLevel);
                return (
                  <button
                    key={p.header.projectId}
                    onClick={() => {
                      setActiveProject(p);
                      setActiveTab('all');
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500 font-semibold ring-1 ring-emerald-500/30'
                        : 'bg-[#0b1016] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{p.header.projectId}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] border ${color}`}>
                      {p.risk.riskLevel} ({p.risk.overallScore})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Master Case Header */}
          <AuditCaseHeader
            header={header}
            risk={risk}
            onExportPDF={() => window.print()}
          />

          {/* Dense Key Forensic Anomaly Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border border-slate-800 bg-[#101720] p-5 space-y-1">
              <p className="text-xs tracking-wider text-slate-500 uppercase font-medium">SANCTIONED VS DISBURSED</p>
              <p className="text-2xl font-semibold text-white">
                {formatINR(header.sanctionedAmount)}
              </p>
              <p className="text-xs text-amber-400 mt-1">
                {header.financialProgressPercent}% Drawn ({formatINR(header.releasedAmount)})
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#101720] p-5 space-y-1">
              <p className="text-xs tracking-wider text-slate-500 uppercase font-medium">PHYSICAL PROGRESS</p>
              <p className="text-2xl font-semibold text-white">
                {header.physicalProgressPercent}%
              </p>
              <p className={`text-xs mt-1 ${header.financialProgressPercent - header.physicalProgressPercent > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                Inversion Gap: {(header.financialProgressPercent - header.physicalProgressPercent)}%
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#101720] p-5 space-y-1">
              <p className="text-xs tracking-wider text-slate-500 uppercase font-medium">COST DEVIATION</p>
              <p className={`text-2xl font-semibold ${evidence.costOutlier.deviationMultiplier > 1.5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {evidence.costOutlier.deviationMultiplier}x
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Median: {formatINR(evidence.costOutlier.peerMedianCost)}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#101720] p-5 space-y-1">
              <p className="text-xs tracking-wider text-slate-500 uppercase font-medium">DUPLICATE OVERLAP</p>
              <p className={`text-2xl font-semibold ${evidence.duplicateMatch.matchScorePercent > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {evidence.duplicateMatch.matchScorePercent}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {evidence.duplicateMatch.distanceMeters}m Proximity
              </p>
            </div>
          </div>

          {/* Section Filter Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-2 rounded-md transition ${
                  activeTab === 'all'
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                ALL DETECTED SIGNALS ({signals ? signals.length : 'ALL'})
              </button>
              <button
                onClick={() => setActiveTab('cost')}
                className={`px-3.5 py-2 rounded-md transition ${
                  activeTab === 'cost'
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                COST OUTLIER ({evidence.costOutlier.deviationMultiplier}x)
              </button>
              <button
                onClick={() => setActiveTab('duplicates')}
                className={`px-3.5 py-2 rounded-md transition ${
                  activeTab === 'duplicates'
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                DUPLICATE MATCH ({evidence.duplicateMatch.matchScorePercent}%)
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3.5 py-2 rounded-md transition ${
                  activeTab === 'timeline'
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                TIMELINE & DISBURSAL
              </button>
              <button
                onClick={() => setActiveTab('geo')}
                className={`px-3.5 py-2 rounded-md transition ${
                  activeTab === 'geo'
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                GEOSPATIAL & LAND
              </button>
            </div>

            <span className="text-xs text-slate-500 hidden sm:block">
              STATUS: <strong className="text-slate-300">{verificationStatus.currentAction || 'PENDING REVIEW'}</strong>
            </span>
          </div>

          {/* ========================================================= */}
          {/* MAIN 12-COLUMN BALANCED GRID: LEFT 8 COLS + RIGHT 4 COLS  */}
          {/* ========================================================= */}
          <div className="grid grid-cols-12 gap-8 items-start w-full">
            {/* Main Left Column (Evidence / Timelines / Anomaly Cards) - 8 COLS */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* 1. Dynamic Signal Mapping when 'ALL' is active */}
              {activeTab === 'all' && signals && signals.length > 0 && (
                <div className="space-y-6">
                  {signals.map((signal, idx) => {
                    switch (signal.type) {
                      case 'COST_ANOMALY':
                        return (
                          <CostOutlierCard
                            key={idx}
                            evidence={evidence.costOutlier}
                            projectSanctionedAmount={header.sanctionedAmount}
                          />
                        );
                      case 'DUPLICATE_WORK':
                        return (
                          <DuplicateSimilarityPanel
                            key={idx}
                            evidence={evidence.duplicateMatch}
                            currentProjectId={header.projectId}
                            currentTitle={header.title}
                            currentSanctionDate={header.sanctionDate}
                            currentSanctionAmount={header.sanctionedAmount}
                            currentAgency={header.implementingAgency}
                            currentLocationName={`${header.category} at ${header.district}, ${header.state}`}
                          />
                        );
                      case 'TIMELINE_VIOLATION':
                        return (
                          <ExecutionTimeline
                            key={idx}
                            timeline={timeline}
                            sanctionedAmount={header.sanctionedAmount}
                            releasedAmount={header.releasedAmount}
                            physicalProgress={header.physicalProgressPercent}
                            financialProgress={header.financialProgressPercent}
                          />
                        );
                      case 'GEOSPATIAL_ANOMALY':
                        return (
                          <GeospatialVerificationCard
                            key={idx}
                            evidence={evidence.geospatial}
                            projectLocationTitle={`${header.title} (${header.district})`}
                            matchedCoords={evidence.duplicateMatch?.matchedGpsCoords}
                            matchedDistanceMeters={evidence.duplicateMatch?.distanceMeters}
                          />
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              )}

              {/* 2. Specific Tab Overrides */}
              {activeTab === 'cost' && (
                <CostOutlierCard
                  evidence={evidence.costOutlier}
                  projectSanctionedAmount={header.sanctionedAmount}
                />
              )}

              {activeTab === 'duplicates' && (
                <DuplicateSimilarityPanel
                  evidence={evidence.duplicateMatch}
                  currentProjectId={header.projectId}
                  currentTitle={header.title}
                  currentSanctionDate={header.sanctionDate}
                  currentSanctionAmount={header.sanctionedAmount}
                  currentAgency={header.implementingAgency}
                  currentLocationName={`${header.category} at ${header.district}, ${header.state}`}
                />
              )}

              {activeTab === 'timeline' && (
                <ExecutionTimeline
                  timeline={timeline}
                  sanctionedAmount={header.sanctionedAmount}
                  releasedAmount={header.releasedAmount}
                  physicalProgress={header.physicalProgressPercent}
                  financialProgress={header.financialProgressPercent}
                />
              )}

              {activeTab === 'geo' && (
                <GeospatialVerificationCard
                  evidence={evidence.geospatial}
                  projectLocationTitle={`${header.title} (${header.district})`}
                  matchedCoords={evidence.duplicateMatch?.matchedGpsCoords}
                  matchedDistanceMeters={evidence.duplicateMatch?.distanceMeters}
                />
              )}
            </div>

            {/* Right Sidebar Column (Action Controls / Official Findings / Agency Risk / Audit History) - 4 COLS */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <ActionControls
                projectId={header.projectId}
                currentStatus={verificationStatus}
                onActionComplete={handleActionComplete}
              />

              <AgencyRiskCard evidence={evidence.agencyRisk} />

              <AuditHistoryDrawer history={auditHistory} />
            </div>
          </div>
        </div>
      </main>
    );
  }
