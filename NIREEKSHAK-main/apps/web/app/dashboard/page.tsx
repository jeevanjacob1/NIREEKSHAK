"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import InitialLoader from "../../components/InitialLoader";
import { formatAmount, type Project } from "../data/projects";
import { dashboardStats, anomalies } from "../../lib/mockData";


export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>({
    totalProjects: 0,
    flaggedProjects: 0,
    highRisk: 0,
    underReview: 0,
    valueAtRisk: 0,
  });


  useEffect(() => {
    Promise.all([
      fetch("/api/projects?page_size=100").then(res => res.json()),
      fetch("/api/analytics/overview").then(res => res.json())
    ]).then(([projectsData, analyticsData]) => {
      setProjects(projectsData.items || []);
      setDashboardStats({
        totalProjects: analyticsData.total_projects || 0,
        flaggedProjects: analyticsData.under_review_projects || 0,
        highRisk: analyticsData.high_risk_projects || 0,
        underReview: analyticsData.under_review_projects || 0,
        valueAtRisk: analyticsData.flagged_amount || 0,
      });
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const highRiskProjects = projects
    .filter((project) => project.risk >= 80)
    .sort((a, b) => b.risk - a.risk);

  const criticalProjects = projects.filter((project) => project.risk >= 90);
  const highProjects = projects.filter(
    (project) => project.risk >= 80 && project.risk < 90
  );
  const mediumProjects = projects.filter(
    (project) => project.risk >= 60 && project.risk < 80
  );
  if (loading) {
  return <InitialLoader onComplete={() => setLoading(false)} />;
}
  return (
    <div className="min-h-screen bg-[#0b1016] text-white">
      <Sidebar />


      <main className="md:ml-[250px]">
        {/* HEADER */}
        <header className="border-b border-[#1d2a38] px-6 py-6 md:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 text-[11px] font-medium tracking-[0.32em] text-emerald-400">
                COMMAND CENTRE
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Intelligence Dashboard
              </h1>

              <p className="mt-2 text-sm text-[#607796]">
                Monitor MPLADS projects, anomalies and potential risks
              </p>
            </div>

            {/* ENGINE STATUS */}
            <div className="flex items-center gap-4 rounded-xl border border-[#1d2a38] bg-[#101720] px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#536a86]">
                  Intelligence Engine
                </div>

                <div className="mt-1 flex items-center gap-2 text-sm font-medium text-emerald-400">
                  Operational
                </div>

                <div className="mt-1 text-[10px] text-[#536a86]">
                  Last sync: 2 min ago
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="space-y-6 p-6 md:p-8">
          {/* STAT CARDS */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              href="/projects"
              label="Total Projects"
              value={dashboardStats.totalProjects.toLocaleString("en-IN")}
              description="Registered projects"
              accent="white"
              action="View projects"
            />

            <StatCard
              href="/projects?risk=flagged"
              label="Flagged Projects"
              value={dashboardStats.flaggedProjects.toLocaleString("en-IN")}
              description="Require attention"
              accent="yellow"
              action="Review flagged"
            />

            <StatCard
              href="/projects?risk=high"
              label="High Risk"
              value={dashboardStats.highRisk.toLocaleString("en-IN")}
              description="Critical indicators"
              accent="red"
              action="View high risk"
            />

            <StatCard
              href="/projects?status=Under%20Review"
              label="Under Review"
              value={dashboardStats.underReview.toLocaleString("en-IN")}
              description="Active investigations"
              accent="white"
              action="View reviews"
            />
          </section>

          {/* PRIORITY STRIP */}
          <section className="rounded-xl border border-[#1d2a38] bg-[#101720] p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-bold tracking-wide text-white">
                  PRIORITY ATTENTION
                </h2>

                <p className="mt-1 text-xs text-[#607796]">
                  Risk distribution across the monitored projects
                </p>
              </div>

              <Link
                href="/projects"
                className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
              >
                VIEW ALL PROJECTS →
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <PriorityCard
                label="Critical"
                count={criticalProjects.length}
                description="Immediate review"
                indicator="bg-red-400"
                text="text-red-400"
              />

              <PriorityCard
                label="High"
                count={highProjects.length}
                description="Requires attention"
                indicator="bg-orange-400"
                text="text-orange-400"
              />

              <PriorityCard
                label="Medium"
                count={mediumProjects.length}
                description="Monitor closely"
                indicator="bg-yellow-400"
                text="text-yellow-400"
              />
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="grid gap-4 lg:grid-cols-3">
            <QuickAction
              href="/projects"
              icon="▥"
              title="Review Projects"
              description="Search and inspect registered MPLADS projects."
            />

            <QuickAction
              href="/investigation"
              icon="⌕"
              title="Investigate Anomalies"
              description="Analyse suspicious project activity."
            />

            <QuickAction
              href="/analytics"
              icon="◒"
              title="View Analytics"
              description="Explore risk and funding patterns."
            />
          </section>

          {/* MAIN DASHBOARD GRID */}
          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
            {/* HIGH RISK PROJECTS */}
            <div className="overflow-hidden rounded-xl border border-[#1d2a38] bg-[#101720]">
              <div className="flex items-center justify-between border-b border-[#1d2a38] px-5 py-5">
                <div>
                  <h2 className="text-base font-bold text-white">
                    HIGH-RISK PROJECTS
                  </h2>

                  <p className="mt-1 text-xs text-[#607796]">
                    Projects requiring immediate attention
                  </p>
                </div>

                <Link
                  href="/projects?risk=high"
                  className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
                >
                  VIEW ALL →
                </Link>
              </div>

              <div>
                {highRiskProjects.slice(0, 4).map((project) => (
                  <Link
                    key={project.id}
                    href={`/investigation?project=${project.id}`}
                    className="group flex items-center justify-between gap-4 border-b border-[#1d2a38] px-5 py-5 transition last:border-b-0 hover:bg-[#121c27]"
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-emerald-400">
                        {project.id}
                      </div>

                      <div className="mt-1 truncate text-sm font-medium text-white">
                        {project.constituency}, {project.state}
                      </div>

                      <div className="mt-1 text-xs text-[#607796]">
                        {formatAmount(project.amount)} · {project.category}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <RiskBadge risk={project.risk} />

                      <span className="hidden text-sm text-[#506780] transition group-hover:translate-x-1 group-hover:text-emerald-400 sm:block">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* RECENT ANOMALIES */}
            <div className="overflow-hidden rounded-xl border border-[#1d2a38] bg-[#101720]">
              <div className="flex items-center justify-between border-b border-[#1d2a38] px-5 py-5">
                <div>
                  <h2 className="text-base font-bold text-white">
                    RECENT ANOMALIES
                  </h2>

                  <p className="mt-1 text-xs text-[#607796]">
                    Latest signals detected by the system
                  </p>
                </div>

                <Link
                  href="/investigation"
                  className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
                >
                  VIEW ALL →
                </Link>
              </div>

              <div>
                {anomalies.slice(0, 4).map((anomaly) => (
                  <Link
                    key={anomaly.id}
                    href={`/investigation?project=${anomaly.projectId}`}
                    className="group block border-b border-[#1d2a38] px-5 py-5 transition last:border-b-0 hover:bg-[#121c27]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {anomaly.type}
                        </div>

                        <p className="mt-2 text-xs leading-5 text-[#607796]">
                          {anomaly.description}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 text-xs font-bold ${
                          anomaly.score >= 90
                            ? "text-red-400"
                            : anomaly.score >= 80
                              ? "text-orange-400"
                              : "text-yellow-400"
                        }`}
                      >
                        {anomaly.score}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] font-medium tracking-wide text-emerald-400">
                        {anomaly.projectId}
                      </span>

                      <span className="text-xs text-[#506780] transition group-hover:text-emerald-400">
                        Investigate →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* SYSTEM ACTIVITY + FUNDING */}
          <section className="grid gap-6 lg:grid-cols-2">
            {/* SYSTEM ACTIVITY */}
            <div className="rounded-xl border border-[#1d2a38] bg-[#101720]">
              <div className="border-b border-[#1d2a38] px-5 py-5">
                <h2 className="text-base font-bold text-white">
                  SYSTEM ACTIVITY
                </h2>

                <p className="mt-1 text-xs text-[#607796]">
                  Recent intelligence events
                </p>
              </div>

              <div className="divide-y divide-[#1d2a38]">
                <ActivityItem
                  time="2 min ago"
                  title="Critical anomaly detected"
                  description="MPL-10482 · Cost anomaly"
                  indicator="bg-red-400"
                />

                <ActivityItem
                  time="8 min ago"
                  title="Risk assessment updated"
                  description="MPL-08731 · Risk score 87"
                  indicator="bg-orange-400"
                />

                <ActivityItem
                  time="15 min ago"
                  title="Project entered review"
                  description="MPL-11294 · Mysuru"
                  indicator="bg-yellow-400"
                />

                <ActivityItem
                  time="23 min ago"
                  title="Analysis completed"
                  description="MPL-09321 · Infrastructure"
                  indicator="bg-emerald-400"
                />
              </div>
            </div>

            {/* FUNDING MONITOR */}
            <div className="rounded-xl border border-[#1d2a38] bg-[#101720]">
              <div className="border-b border-[#1d2a38] px-5 py-5">
                <h2 className="text-base font-bold text-white">
                  FUNDING MONITOR
                </h2>

                <p className="mt-1 text-xs text-[#607796]">
                  Current allocation and analysis coverage
                </p>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-[#1d2a38] bg-[#0c131b] p-4">
                    <div className="text-[10px] uppercase tracking-[0.15em] text-[#536a86]">
                      Total Allocation
                    </div>

                    <div className="mt-2 text-2xl font-bold text-white">
                      {dashboardStats.totalAllocation}
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#1d2a38] bg-[#0c131b] p-4">
                    <div className="text-[10px] uppercase tracking-[0.15em] text-[#536a86]">
                      Analysed Amount
                    </div>

                    <div className="mt-2 text-2xl font-bold text-emerald-400">
                      {dashboardStats.analysedAmount}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-[#607796]">
                      Analysis coverage
                    </span>

                    <span className="text-xs font-semibold text-white">
                      81.2%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#1a2633]">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all"
                      style={{ width: "81.2%" }}
                    />
                  </div>
                </div>

                <Link
                  href="/analytics"
                  className="mt-5 inline-flex text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
                >
                  VIEW FUNDING ANALYTICS →
                </Link>
              </div>
            </div>
          </section>

          {/* FOOTER STATUS */}
          <div className="flex flex-col gap-2 border-t border-[#1d2a38] pt-5 text-[10px] text-[#536a86] sm:flex-row sm:items-center sm:justify-between">
            <span>
              TRUSTUS · MPLADS INTELLIGENCE PLATFORM
            </span>

            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All monitoring systems operational
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------------------------------------
   STAT CARD
--------------------------------------------- */

function StatCard({
  href,
  label,
  value,
  description,
  accent,
  action,
}: {
  href: string;
  label: string;
  value: string;
  description: string;
  accent: "white" | "yellow" | "red";
  action: string;
}) {
  const valueClass =
    accent === "red"
      ? "text-red-400"
      : accent === "yellow"
        ? "text-yellow-400"
        : "text-white";

  return (
    <Link
      href={href}
      className="group rounded-xl border border-[#1d2a38] bg-[#101720] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#294052] hover:bg-[#121b25]"
    >
      <div className="flex items-start justify-between">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#536a86]">
          {label}
        </div>

        <span className="text-sm text-[#425a73] transition group-hover:translate-x-1 group-hover:text-emerald-400">
          →
        </span>
      </div>

      <div className={`mt-4 text-3xl font-bold ${valueClass}`}>
        {value}
      </div>

      <div className="mt-1 text-xs text-[#536a86]">
        {description}
      </div>

      <div className="mt-4 text-[10px] font-medium text-[#536a86] transition group-hover:text-emerald-400">
        {action} →
      </div>
    </Link>
  );
}

/* ---------------------------------------------
   PRIORITY CARD
--------------------------------------------- */

function PriorityCard({
  label,
  count,
  description,
  indicator,
  text,
}: {
  label: string;
  count: number;
  description: string;
  indicator: string;
  text: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#1d2a38] bg-[#0c131b] px-4 py-4">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${indicator}`} />

        <div>
          <div className={`text-sm font-semibold ${text}`}>
            {label}
          </div>

          <div className="mt-1 text-[10px] text-[#536a86]">
            {description}
          </div>
        </div>
      </div>

      <div className={`text-2xl font-bold ${text}`}>
        {count}
      </div>
    </div>
  );
}

/* ---------------------------------------------
   QUICK ACTION
--------------------------------------------- */

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-[#1d2a38] bg-[#101720] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:bg-[#121b25]"
    >
      <div className="flex items-start justify-between">
        <span className="text-xl text-emerald-400">
          {icon}
        </span>

        <span className="text-sm text-[#425a73] transition group-hover:translate-x-1 group-hover:text-emerald-400">
          →
        </span>
      </div>

      <h3 className="mt-5 text-sm font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-[#536a86]">
        {description}
      </p>
    </Link>
  );
}

/* ---------------------------------------------
   RISK BADGE
--------------------------------------------- */

function RiskBadge({ risk }: { risk: number }) {
  const style =
    risk >= 90
      ? "border-red-500/40 bg-red-500/10 text-red-400"
      : risk >= 80
        ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
        : "border-yellow-500/40 bg-yellow-500/10 text-yellow-400";

  return (
    <span
      className={`rounded-md border px-3 py-2 text-[11px] font-bold ${style}`}
    >
      {risk} RISK
    </span>
  );
}

/* ---------------------------------------------
   ACTIVITY ITEM
--------------------------------------------- */

function ActivityItem({
  time,
  title,
  description,
  indicator,
}: {
  time: string;
  title: string;
  description: string;
  indicator: string;
}) {
  return (
    <div className="flex items-start gap-4 px-5 py-4">
      <span
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${indicator}`}
      />

      <div className="min-w-0">
        <div className="text-sm font-medium text-white">
          {title}
        </div>

        <div className="mt-1 text-xs text-[#607796]">
          {description}
        </div>
      </div>

      <span className="ml-auto shrink-0 text-[10px] text-[#536a86]">
        {time}
      </span>
    </div>
  );
}