export const dashboardStats = {
  totalProjects: 12482,
  flaggedProjects: 317,
  highRisk: 86,
  underReview: 143,
  totalAllocation: "₹482.6 Cr",
  analysedAmount: "₹391.8 Cr",
};

export const monthlyProjects = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 55 },
  { month: "Mar", value: 48 },
  { month: "Apr", value: 71 },
  { month: "May", value: 64 },
  { month: "Jun", value: 83 },
  { month: "Jul", value: 76 },
  { month: "Aug", value: 91 },
];

export const riskDistribution = [
  { label: "Low Risk", value: 61 },
  { label: "Medium Risk", value: 28 },
  { label: "High Risk", value: 11 },
];

export const anomalies = [
  {
    id: "ANM-001",
    projectId: "MPL-10482",
    type: "Cost Anomaly",
    severity: "Critical",
    score: 91,
    description:
      "Project cost is significantly higher than comparable projects in the same category.",
  },
  {
    id: "ANM-002",
    projectId: "MPL-08731",
    type: "Duplicate Pattern",
    severity: "High",
    score: 87,
    description:
      "Project description and estimated amount closely match another registered work.",
  },
  {
    id: "ANM-003",
    projectId: "MPL-11294",
    type: "Vendor Pattern",
    severity: "High",
    score: 84,
    description:
      "Repeated contractor association detected across multiple projects.",
  },
  {
    id: "ANM-004",
    projectId: "MPL-09321",
    type: "Fund Utilisation",
    severity: "High",
    score: 81,
    description:
      "Reported utilisation pattern differs from the expected project timeline.",
  },
];