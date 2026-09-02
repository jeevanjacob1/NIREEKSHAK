export type ProjectStatus =
  | "Under Review"
  | "Active"
  | "Completed"
  | "Flagged";

export type Project = {
  id: string;
  state: string;
  constituency: string;
  district: string;
  category: string;
  description: string;
  amount: number;
  status: ProjectStatus;
  risk: number;
  year: number;
};

export const projects: Project[] = [
  {
    id: "MPL-10482",
    state: "Kerala",
    constituency: "Alappuzha",
    district: "Alappuzha",
    category: "Infrastructure",
    description:
      "Construction of community road and drainage system",
    amount: 4200000,
    status: "Under Review",
    risk: 91,
    year: 2025,
  },
  {
    id: "MPL-08731",
    state: "Tamil Nadu",
    constituency: "Madurai",
    district: "Madurai",
    category: "Education",
    description:
      "Construction and renovation of government school facilities",
    amount: 3850000,
    status: "Active",
    risk: 87,
    year: 2025,
  },
  {
    id: "MPL-11294",
    state: "Karnataka",
    constituency: "Mysuru",
    district: "Mysuru",
    category: "Healthcare",
    description:
      "Upgradation of primary healthcare centre",
    amount: 3120000,
    status: "Completed",
    risk: 84,
    year: 2024,
  },
  {
    id: "MPL-09321",
    state: "Maharashtra",
    constituency: "Pune",
    district: "Pune",
    category: "Infrastructure",
    description:
      "Urban public facility improvement project",
    amount: 2870000,
    status: "Active",
    risk: 81,
    year: 2025,
  },
  {
    id: "MPL-07642",
    state: "Kerala",
    constituency: "Kollam",
    district: "Kollam",
    category: "Water Supply",
    description:
      "Installation of drinking water infrastructure",
    amount: 1940000,
    status: "Completed",
    risk: 64,
    year: 2024,
  },
  {
    id: "MPL-11903",
    state: "Kerala",
    constituency: "Kottayam",
    district: "Kottayam",
    category: "Education",
    description:
      "Digital classroom equipment procurement",
    amount: 1650000,
    status: "Active",
    risk: 58,
    year: 2025,
  },
  {
    id: "MPL-12147",
    state: "Karnataka",
    constituency: "Bengaluru Rural",
    district: "Bengaluru Rural",
    category: "Roads",
    description:
      "Village road resurfacing project",
    amount: 2250000,
    status: "Active",
    risk: 73,
    year: 2025,
  },
  {
    id: "MPL-09921",
    state: "Tamil Nadu",
    constituency: "Coimbatore",
    district: "Coimbatore",
    category: "Sanitation",
    description:
      "Community sanitation infrastructure",
    amount: 1780000,
    status: "Completed",
    risk: 42,
    year: 2024,
  },
];

export const formatAmount = (amount: number) => {
  return `₹${(amount / 100000).toFixed(1)} L`;
};

export const formatFullAmount = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};