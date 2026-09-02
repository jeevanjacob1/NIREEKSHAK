"use client";

import { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  monthlyProjects,
  riskDistribution,
} from "../../lib/mockData";

export default function AnalyticsPage() {
  const [range, setRange] = useState<"All" | "Recent">("All");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    null
  );
  const [selectedRisk, setSelectedRisk] = useState<string | null>(
    null
  );

  const visibleProjects = useMemo(() => {
    if (range === "Recent") {
      return monthlyProjects.slice(-4);
    }

    return monthlyProjects;
  }, [range]);

  const maxValue = Math.max(
    ...visibleProjects.map((item) => item.value)
  );

  const selectedMonthData = monthlyProjects.find(
    (item) => item.month === selectedMonth
  );

  const selectedRiskData = riskDistribution.find(
    (item) => item.label === selectedRisk
  );

  return (
    <main className="flex min-h-screen bg-[#0b1016] text-white">
      <Sidebar />

      <div className="min-w-0 flex-1 overflow-auto">
        <header className="border-b border-slate-800 px-6 py-6 md:px-8">
          <p className="text-xs tracking-[0.25em] text-emerald-400">
            INTELLIGENCE ANALYTICS
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Analytics
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Understand project patterns, risk distribution and activity
          </p>
        </header>

        <section className="space-y-6 px-6 py-8 md:px-8">
          {/* SUMMARY */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AnalyticsCard
              title="PROJECTS ANALYSED"
              value="12,482"
              change="+8.4%"
            />

            <AnalyticsCard
              title="ANOMALIES DETECTED"
              value="317"
              change="+12.7%"
            />

            <AnalyticsCard
              title="HIGH RISK RATE"
              value="11.2%"
              change="-2.1%"
            />

            <AnalyticsCard
              title="ANALYSIS COVERAGE"
              value="81.2%"
              change="+6.8%"
            />
          </div>

          {/* CHART */}
          <div className="rounded-xl border border-slate-800 bg-[#101720] p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h2 className="font-semibold">
                  PROJECT ACTIVITY
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  Monthly project registrations detected by the platform
                </p>
              </div>

              <div className="flex rounded-lg border border-slate-800 bg-[#0d141c] p-1">
                {(["All", "Recent"] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setRange(option)}
                    className={`rounded-md px-3 py-1.5 text-xs transition ${
                      range === option
                        ? "bg-emerald-500 text-black"
                        : "text-slate-500 hover:text-white"
                    }`}
                  >
                    {option === "All" ? "ALL MONTHS" : "RECENT"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex h-64 items-end gap-2 border-b border-l border-slate-800 px-3 pb-0 sm:gap-3">
              {visibleProjects.map((item) => {
                const height = (item.value / maxValue) * 100;
                const active = selectedMonth === item.month;

                return (
                  <button
                    key={item.month}
                    onClick={() => setSelectedMonth(item.month)}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2 outline-none"
                  >
                    <span
                      className={`text-[10px] ${
                        active
                          ? "text-emerald-400"
                          : "text-slate-500"
                      }`}
                    >
                      {item.value}
                    </span>

                    <div
                      className={`w-full max-w-12 rounded-t transition-all duration-300 ${
                        active
                          ? "bg-emerald-300"
                          : "bg-emerald-500/70 hover:bg-emerald-400"
                      }`}
                      style={{ height: `${height}%` }}
                    />

                    <span
                      className={`translate-y-5 text-[10px] ${
                        active
                          ? "text-emerald-400"
                          : "text-slate-600"
                      }`}
                    >
                      {item.month}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedMonthData && (
              <div className="mt-8 rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] tracking-widest text-emerald-500">
                      SELECTED MONTH
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedMonthData.month}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-semibold text-emerald-400">
                      {selectedMonthData.value}
                    </p>

                    <p className="text-[10px] text-slate-600">
                      registrations
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RISK */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-[#101720] p-6">
              <h2 className="font-semibold">
                RISK DISTRIBUTION
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Click a category for more information
              </p>

              <div className="mt-8 space-y-6">
                {riskDistribution.map((item) => {
                  const active = selectedRisk === item.label;

                  return (
                    <button
                      key={item.label}
                      onClick={() => setSelectedRisk(item.label)}
                      className="w-full text-left"
                    >
                      <div className="mb-2 flex justify-between text-xs">
                        <span
                          className={
                            active
                              ? "text-emerald-400"
                              : "text-slate-400"
                          }
                        >
                          {item.label}
                        </span>

                        <span className="text-slate-300">
                          {item.value}%
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            active
                              ? "bg-emerald-300"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedRiskData && (
                <div className="mt-8 rounded-lg border border-slate-800 bg-[#0d141c] p-4">
                  <p className="text-xs text-slate-500">
                    SELECTED CLASSIFICATION
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-slate-300">
                      {selectedRiskData.label}
                    </span>

                    <span className="font-mono text-emerald-400">
                      {selectedRiskData.value}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#101720] p-6">
              <h2 className="font-semibold">KEY SIGNALS</h2>

              <p className="mt-1 text-xs text-slate-600">
                Patterns currently contributing to risk scores
              </p>

              <div className="mt-6 space-y-3">
                <Signal
                  title="Unusual project costs"
                  value="38%"
                />

                <Signal
                  title="Potential duplicates"
                  value="24%"
                />

                <Signal
                  title="Vendor concentration"
                  value="19%"
                />

                <Signal
                  title="Fund utilisation mismatch"
                  value="12%"
                />

                <Signal
                  title="Timeline irregularities"
                  value="7%"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function AnalyticsCard({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#101720] p-5 transition hover:border-slate-700">
      <p className="text-[10px] tracking-[0.18em] text-slate-600">
        {title}
      </p>

      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl font-semibold">{value}</p>

        <span className="text-xs text-emerald-400">
          {change}
        </span>
      </div>
    </div>
  );
}

function Signal({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#0d141c] px-4 py-4 transition hover:border-slate-700">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />

        <span className="text-sm text-slate-400">
          {title}
        </span>
      </div>

      <span className="font-mono text-xs text-slate-300">
        {value}
      </span>
    </div>
  );
}