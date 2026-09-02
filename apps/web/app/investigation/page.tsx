"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  projects,
  formatFullAmount,
} from "../data/projects";
import { analyseProject } from "../../lib/anomaly";

export default function InvestigationPage() {
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const [reviewStarted, setReviewStarted] = useState(false);
  const [followUp, setFollowUp] = useState(false);

  // Read project ID from:
  // /investigation?project=MPL-10482
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("project");

    if (projectId && projects.some((project) => project.id === projectId)) {
      setSelectedId(projectId);
    }
  }, []);

  // Reset investigation actions whenever the selected project changes.
  useEffect(() => {
    setReviewStarted(false);
    setFollowUp(false);
  }, [selectedId]);

  const selectedProject =
    projects.find((project) => project.id === selectedId) ||
    projects[0];

  const analysis = analyseProject(selectedProject);

  const flaggedProjects = projects
    .filter((project) => project.risk >= 60)
    .sort((a, b) => b.risk - a.risk);

  const reviewProgress = reviewStarted ? 65 : 0;

  return (
    <main className="flex min-h-screen w-full overflow-x-hidden bg-[#0b1016] text-white">
      <Sidebar />

      <div className="min-w-0 flex-1 overflow-x-hidden">
        {/* HEADER */}
        <header className="border-b border-slate-800 px-6 py-6 md:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs tracking-[0.25em] text-emerald-400">
                INVESTIGATION CENTRE
              </p>

              <h1 className="mt-2 text-3xl font-semibold">
                Project Investigation
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Analyse flagged MPLADS projects and identify potential
                anomalies.
              </p>
            </div>

            <Link
              href="/projects"
              className="inline-flex w-fit items-center rounded-md border border-slate-700 px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:border-emerald-900 hover:text-emerald-400"
            >
              ← BACK TO PROJECTS
            </Link>
          </div>
        </header>

        <section className="px-6 py-8 md:px-8">
          <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
            {/* PROJECT LIST */}
            <div className="h-fit rounded-xl border border-slate-800 bg-[#101720]">
              <div className="border-b border-slate-800 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs tracking-widest text-slate-500">
                    FLAGGED PROJECTS
                  </p>

                  <span className="rounded-full border border-red-900/60 bg-red-950/20 px-2 py-1 text-[9px] text-red-400">
                    {flaggedProjects.length} FLAGGED
                  </span>
                </div>

                <p className="mt-1 text-[10px] text-slate-700">
                  Select a project to investigate
                </p>
              </div>

              <div className="max-h-[650px] overflow-y-auto">
                {flaggedProjects.map((project) => {
                  const active = selectedId === project.id;

                  return (
                    <button
                      key={project.id}
                      onClick={() => setSelectedId(project.id)}
                      className={`w-full border-b border-slate-800/70 px-5 py-5 text-left transition ${
                        active
                          ? "bg-emerald-950/20"
                          : "hover:bg-slate-900/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xs text-emerald-400">
                          {project.id}
                        </span>

                        <span
                          className={`text-xs font-semibold ${
                            project.risk >= 90
                              ? "text-red-400"
                              : project.risk >= 80
                                ? "text-orange-400"
                                : "text-amber-400"
                          }`}
                        >
                          {project.risk}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-300">
                        {project.constituency}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        {project.category}
                      </p>

                      {active && (
                        <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-emerald-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Currently investigating
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* WORKSPACE */}
            <div className="min-w-0 space-y-6">
              {/* PROJECT HEADER */}
              <div className="rounded-xl border border-slate-800 bg-[#101720] p-6">
                <div className="flex flex-col justify-between gap-6 md:flex-row">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-mono text-xs text-emerald-400">
                        {selectedProject.id}
                      </p>

                      <span
                        className={`rounded border px-2 py-1 text-[9px] tracking-wider ${
                          analysis.level === "Critical"
                            ? "border-red-900 bg-red-950/30 text-red-400"
                            : analysis.level === "High"
                              ? "border-orange-900 bg-orange-950/30 text-orange-400"
                              : analysis.level === "Medium"
                                ? "border-amber-900 bg-amber-950/30 text-amber-400"
                                : "border-emerald-900 bg-emerald-950/30 text-emerald-400"
                        }`}
                      >
                        {analysis.level.toUpperCase()} RISK
                      </span>
                    </div>

                    <h2 className="mt-3 break-words text-2xl font-semibold">
                      {selectedProject.description}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {selectedProject.constituency},{" "}
                      {selectedProject.state}
                    </p>
                  </div>

                  {/* RISK SCORE */}
                  <div
                    className={`flex h-24 w-24 shrink-0 flex-col items-center justify-center self-start rounded-full border-4 ${
                      analysis.score >= 90
                        ? "border-red-500/60"
                        : analysis.score >= 80
                          ? "border-amber-500/60"
                          : "border-emerald-500/60"
                    }`}
                  >
                    <span className="text-2xl font-bold">
                      {analysis.score}
                    </span>

                    <span className="text-[9px] tracking-widest text-slate-500">
                      RISK
                    </span>
                  </div>
                </div>
              </div>

              {/* DETAILS */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoCard
                  label="AMOUNT"
                  value={formatFullAmount(selectedProject.amount)}
                />

                <InfoCard
                  label="CATEGORY"
                  value={selectedProject.category}
                />

                <InfoCard
                  label="STATUS"
                  value={selectedProject.status}
                />

                <InfoCard
                  label="YEAR"
                  value={selectedProject.year.toString()}
                />
              </div>

              {/* ANALYSIS */}
              <div className="rounded-xl border border-slate-800 bg-[#101720]">
                <div className="border-b border-slate-800 px-6 py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-semibold">
                        ANOMALY ANALYSIS
                      </h2>

                      <p className="mt-1 text-xs text-slate-600">
                        Automated intelligence assessment
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded border px-3 py-1 text-xs ${
                        analysis.level === "Critical"
                          ? "border-red-900 bg-red-950/30 text-red-400"
                          : analysis.level === "High"
                            ? "border-orange-900 bg-orange-950/30 text-orange-400"
                            : analysis.level === "Medium"
                              ? "border-yellow-900 bg-yellow-950/20 text-yellow-400"
                              : "border-emerald-900 bg-emerald-950/30 text-emerald-400"
                      }`}
                    >
                      {analysis.level}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="rounded-lg border border-slate-800 bg-[#0d141c] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[10px] tracking-widest text-slate-600">
                          INTELLIGENCE ASSESSMENT
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          The TrustUs analysis engine has identified{" "}
                          <span className="font-medium text-white">
                            {analysis.findings.length} potential indicator
                            {analysis.findings.length !== 1 ? "s" : ""}
                          </span>{" "}
                          requiring verification.
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-[10px] tracking-widest text-slate-600">
                          RISK SCORE
                        </p>

                        <p
                          className={`mt-1 text-lg font-semibold ${
                            analysis.score >= 90
                              ? "text-red-400"
                              : analysis.score >= 80
                                ? "text-orange-400"
                                : "text-amber-400"
                          }`}
                        >
                          {analysis.score}/100
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {analysis.findings.length > 0 ? (
                      analysis.findings.map((finding, index) => (
                        <div
                          key={`${selectedProject.id}-${index}`}
                          className="flex gap-4 rounded-lg border border-slate-800 bg-[#0d141c] p-4 transition hover:border-slate-700"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-950 text-xs text-red-400">
                            {index + 1}
                          </span>

                          <p className="text-sm leading-6 text-slate-400">
                            {finding}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-5">
                        <p className="text-sm text-emerald-400">
                          No significant anomaly indicators detected.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="rounded-xl border border-slate-800 bg-[#101720] p-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() =>
                      setReviewStarted((current) => !current)
                    }
                    className={`rounded-md px-5 py-3 text-sm font-semibold transition ${
                      reviewStarted
                        ? "border border-emerald-900 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-950/50"
                        : "bg-emerald-500 text-black hover:bg-emerald-400"
                    }`}
                  >
                    {reviewStarted
                      ? "✓ REVIEW IN PROGRESS"
                      : "START DETAILED REVIEW"}
                  </button>

                  <button
                    onClick={() =>
                      setFollowUp((current) => !current)
                    }
                    className={`rounded-md border px-5 py-3 text-sm transition ${
                      followUp
                        ? "border-amber-900 bg-amber-950/30 text-amber-400 hover:bg-amber-950/50"
                        : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                    }`}
                  >
                    {followUp
                      ? "✓ MARKED FOR FOLLOW-UP"
                      : "MARK FOR FOLLOW-UP"}
                  </button>
                </div>

                {/* REVIEW PROGRESS */}
                {reviewStarted && (
                  <div className="mt-5 rounded-lg border border-slate-800 bg-[#0d141c] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-300">
                          Detailed review
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          Investigation workflow initiated locally
                        </p>
                      </div>

                      <span className="text-xs font-mono text-emerald-400">
                        {reviewProgress}%
                      </span>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${reviewProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* ACTIVE STATES */}
                {(reviewStarted || followUp) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {reviewStarted && (
                      <span className="rounded border border-emerald-900 bg-emerald-950/30 px-3 py-1.5 text-xs text-emerald-400">
                        Detailed review active
                      </span>
                    )}

                    {followUp && (
                      <span className="rounded border border-amber-900 bg-amber-950/30 px-3 py-1.5 text-xs text-amber-400">
                        Follow-up required
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* PROJECT NAVIGATION */}
              <div className="flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] tracking-widest text-slate-600">
                    CURRENT PROJECT
                  </p>

                  <p className="mt-1 font-mono text-xs text-slate-500">
                    {selectedProject.id}
                  </p>
                </div>

                <Link
                  href={`/projects?search=${encodeURIComponent(
                    selectedProject.id
                  )}`}
                  className="rounded-md border border-slate-800 px-4 py-2.5 text-xs text-slate-500 transition hover:border-emerald-900 hover:text-emerald-400"
                >
                  VIEW PROJECT DETAILS →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#101720] p-5 transition hover:border-slate-700">
      <p className="text-[10px] tracking-widest text-slate-600">
        {label}
      </p>

      <p className="mt-3 truncate text-sm font-medium text-slate-300">
        {value}
      </p>
    </div>
  );
}