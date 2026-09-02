export type AnomalyResult = {
  score: number;
  level: "Low" | "Medium" | "High" | "Critical";
  findings: string[];
};

export function analyseProject(project: {
  amount: number;
  risk: number;
  category: string;
  status: string;
}): AnomalyResult {
  const findings: string[] = [];

  if (project.risk >= 90) {
    findings.push(
      "Risk score is in the critical range and requires immediate review."
    );
  } else if (project.risk >= 80) {
    findings.push(
      "Risk score is significantly above the normal project threshold."
    );
  } else if (project.risk >= 60) {
    findings.push(
      "Project displays moderate indicators that require additional verification."
    );
  }

  if (project.amount >= 4000000) {
    findings.push(
      "Estimated project amount is relatively high and should be compared with similar works."
    );
  }

  if (project.status === "Under Review") {
    findings.push(
      "Project is currently under review and contains unresolved risk indicators."
    );
  }

  if (project.category === "Infrastructure") {
    findings.push(
      "Infrastructure projects should be cross-checked against location and cost benchmarks."
    );
  }

  if (project.status === "Active" && project.risk >= 80) {
    findings.push(
      "An active project with a high risk score should be checked against current implementation and expenditure records."
    );
  }

  let level: AnomalyResult["level"] = "Low";

  if (project.risk >= 90) {
    level = "Critical";
  } else if (project.risk >= 80) {
    level = "High";
  } else if (project.risk >= 60) {
    level = "Medium";
  }

  return {
    score: project.risk,
    level,
    findings,
  };
}