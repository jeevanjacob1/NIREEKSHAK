"use client";

import { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { projects, formatAmount } from "../data/projects";

const reportOptions = [
  "Risk Summary",
  "High Risk Projects",
  "Fund Utilisation",
  "Anomaly Overview",
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState("Risk Summary");
  const [generated, setGenerated] = useState(false);
  const [generatedAt, setGeneratedAt] = useState("");

  const highRisk = projects.filter(
    (project) => project.risk >= 80
  );

  const mediumRisk = projects.filter(
    (project) => project.risk >= 60 && project.risk < 80
  );

  const reportRows = useMemo(() => {
    switch (reportType) {
      case "High Risk Projects":
        return highRisk;

      case "Fund Utilisation":
        return projects.filter(
          (project) => project.status !== "Completed"
        );

      case "Anomaly Overview":
        return projects.filter(
          (project) => project.risk >= 60
        );

      default:
        return highRisk;
    }
  }, [reportType, highRisk]);

  const generateReport = () => {
    const now = new Date();

    setGenerated(true);
    setGeneratedAt(
      now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  };

  const exportCSV = () => {
    const header = [
      "Project ID",
      "State",
      "Constituency",
      "Category",
      "Amount",
      "Status",
      "Risk",
      "Year",
    ];

    const rows = reportRows.map((project) => [
      project.id,
      project.state,
      project.constituency,
      project.category,
      project.amount,
      project.status,
      project.risk,
      project.year,
    ]);

    const csv = [
      header,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportType
      .toLowerCase()
      .replaceAll(" ", "-")}-report.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <main className="flex min-h-screen bg-[#0b1016] text-white">
      <Sidebar />

      <div className="min-w-0 flex-1 overflow-auto">
        <header className="border-b border-slate-800 px-6 py-6 md:px-8">
          <p className="text-xs tracking-[0.25em] text-emerald-400">
            REPORTING CENTRE
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Intelligence Reports
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Generate structured reports from MPLADS intelligence data
          </p>
        </header>

        <section className="space-y-6 px-6 py-8 md:px-8">
          {/* GENERATOR */}
          <div className="rounded-xl border border-slate-800 bg-[#101720] p-6">
            <h2 className="font-semibold">GENERATE REPORT</h2>

            <p className="mt-1 text-xs text-slate-600">
              Select the type of intelligence report you want to generate.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
              <select
                value={reportType}
                onChange={(e) => {
                  setReportType(e.target.value);
                  setGenerated(false);
                }}
                className="rounded-md border border-slate-700 bg-[#0b1016] px-4 py-3 text-sm text-slate-300 outline-none focus:border-emerald-500"
              >
                {reportOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>

              <button
                onClick={generateReport}
                className="rounded-md bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
              >
                GENERATE REPORT
              </button>
            </div>

            {generated && (
              <div className="mt-5 rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-black">
                    ✓
                  </span>

                  <div>
                    <p className="text-sm font-medium text-emerald-300">
                      Report generated successfully
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {reportType} • Generated at {generatedAt}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* REPORT PREVIEW */}
          <div className="rounded-xl border border-slate-800 bg-[#101720]">
            <div className="border-b border-slate-800 px-6 py-5">
              <p className="text-[10px] tracking-widest text-slate-600">
                REPORT PREVIEW
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                {reportType}
              </h2>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-3">
              <ReportStat
                label="TOTAL PROJECTS"
                value={projects.length.toString()}
              />

              <ReportStat
                label="HIGH RISK"
                value={highRisk.length.toString()}
              />

              <ReportStat
                label="MEDIUM RISK"
                value={mediumRisk.length.toString()}
              />
            </div>

            <div className="border-t border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-left text-sm">
                  <thead className="bg-[#0d141c] text-xs text-slate-500">
                    <tr>
                      <th className="px-6 py-4">PROJECT</th>
                      <th className="px-6 py-4">LOCATION</th>
                      <th className="px-6 py-4">CATEGORY</th>
                      <th className="px-6 py-4">AMOUNT</th>
                      <th className="px-6 py-4">STATUS</th>
                      <th className="px-6 py-4">RISK</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reportRows.map((project) => (
                      <tr
                        key={project.id}
                        className="border-t border-slate-800/70 transition hover:bg-slate-900/50"
                      >
                        <td className="px-6 py-4 font-mono text-xs text-emerald-400">
                          {project.id}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {project.constituency},{" "}
                          {project.state}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {project.category}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {formatAmount(project.amount)}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {project.status}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded border px-2 py-1 text-xs ${
                              project.risk >= 80
                                ? "border-red-900 bg-red-950/30 text-red-400"
                                : project.risk >= 60
                                  ? "border-amber-900 bg-amber-950/30 text-amber-400"
                                  : "border-emerald-900 bg-emerald-950/30 text-emerald-400"
                            }`}
                          >
                            {project.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {reportRows.length === 0 && (
                <div className="p-10 text-center text-sm text-slate-500">
                  No projects available for this report.
                </div>
              )}
            </div>

            <div className="no-print flex flex-col gap-3 border-t border-slate-800 p-5 sm:flex-row sm:justify-end">
              <button
                onClick={exportCSV}
                className="rounded-md border border-slate-700 px-5 py-2.5 text-xs text-slate-400 transition hover:border-emerald-900 hover:text-emerald-400"
              >
                EXPORT CSV
              </button>

              <button
                onClick={printReport}
                className="rounded-md border border-slate-700 px-5 py-2.5 text-xs text-slate-400 transition hover:border-emerald-900 hover:text-emerald-400"
              >
                PRINT REPORT
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ReportStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-[#0d141c] p-5 transition hover:border-slate-700">
      <p className="text-[10px] tracking-widest text-slate-600">
        {label}
      </p>

      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  );
}