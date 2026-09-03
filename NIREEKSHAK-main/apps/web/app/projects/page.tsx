"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import {
  projects,
  formatAmount,
  formatFullAmount,
  type Project,
} from "../data/projects";

type SortOption =
  | "Risk: High to Low"
  | "Risk: Low to High"
  | "Amount: High to Low"
  | "Amount: Low to High"
  | "Year: Newest"
  | "Year: Oldest"
  | "State: A to Z";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [riskFilter, setRiskFilter] = useState("All Risk Levels");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortBy, setSortBy] =
    useState<SortOption>("Risk: High to Low");

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/projects?page=${page}&page_size=50`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.items || []);
        setTotalPages(data.total_pages || Math.ceil((data.total || 60000) / 50));
        setTotalRecords(data.total || 60359);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setIsLoading(false);
      });
  }, [page]);

  /*
   * Close modal with Escape.
   * Also prevent background scrolling while modal is open.
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  /*
   * Filter + sort projects.
   */
  const filteredProjects = useMemo(() => {
    const query = search.toLowerCase().trim();

    const filtered = projects.filter((project) => {
      const matchesSearch =
        project.id.toLowerCase().includes(query) ||
        project.state.toLowerCase().includes(query) ||
        project.district.toLowerCase().includes(query) ||
        project.constituency.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.status.toLowerCase().includes(query);

      const matchesState =
        stateFilter === "All States" ||
        project.state === stateFilter;

      const matchesRisk =
        riskFilter === "All Risk Levels" ||
        (riskFilter === "High Risk" && project.risk >= 80) ||
        (riskFilter === "Medium Risk" &&
          project.risk >= 60 &&
          project.risk < 80) ||
        (riskFilter === "Low Risk" && project.risk < 60);

      const matchesStatus =
        statusFilter === "All Statuses" ||
        project.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All Categories" ||
        project.category === categoryFilter;

      return (
        matchesSearch &&
        matchesState &&
        matchesRisk &&
        matchesStatus &&
        matchesCategory
      );
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "Risk: High to Low":
          return b.risk - a.risk;

        case "Risk: Low to High":
          return a.risk - b.risk;

        case "Amount: High to Low":
          return b.amount - a.amount;

        case "Amount: Low to High":
          return a.amount - b.amount;

        case "Year: Newest":
          return b.year - a.year;

        case "Year: Oldest":
          return a.year - b.year;

        case "State: A to Z":
          return a.state.localeCompare(b.state);

        default:
          return 0;
      }
    });
  }, [
    search,
    stateFilter,
    riskFilter,
    statusFilter,
    categoryFilter,
    sortBy,
    projects,
  ]);

  const hasActiveFilters =
    search.trim() !== "" ||
    stateFilter !== "All States" ||
    riskFilter !== "All Risk Levels" ||
    statusFilter !== "All Statuses" ||
    categoryFilter !== "All Categories";

  const highRiskCount = filteredProjects.filter(
    (project) => project.risk >= 80
  ).length;

  const mediumRiskCount = filteredProjects.filter(
    (project) => project.risk >= 60 && project.risk < 80
  ).length;

  const lowRiskCount = filteredProjects.filter(
    (project) => project.risk < 60
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStateFilter("All States");
    setRiskFilter("All Risk Levels");
    setStatusFilter("All Statuses");
    setCategoryFilter("All Categories");
    setSortBy("Risk: High to Low");
  };

  return (
    <>
      {/*
       * IMPORTANT:
       * Sidebar now contains its own desktop width spacer.
       * Do NOT add ml-[250px] anywhere here.
       */}
      <main className="flex min-h-screen w-full bg-[#0b1016] text-white">
        <Sidebar />

        <div className="min-w-0 flex-1 overflow-x-hidden">
          {/* PAGE HEADER */}
          <header className="border-b border-slate-800 px-6 py-6 md:px-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs tracking-[0.25em] text-emerald-400">
                  PROJECT REGISTRY
                </p>

                <h1 className="mt-2 text-3xl font-semibold">
                  MPLADS Projects
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Search, filter and investigate registered development
                  projects
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-[#101720] px-5 py-3 text-left md:text-right">
                <p className="text-[10px] tracking-[0.2em] text-slate-600">
                  TOTAL RECORDS
                </p>

                <p className="mt-1 text-xl font-semibold">
                  12,482
                </p>

                <p className="mt-1 text-[10px] text-emerald-500">
                  REGISTRY CONNECTED
                </p>
              </div>
            </div>
          </header>

          <section className="px-6 py-8 md:px-8">
            {/* QUICK RISK SUMMARY */}
            <div className="grid gap-3 sm:grid-cols-3">
              <RiskSummaryCard
                label="HIGH RISK"
                value={highRiskCount}
                description="Requires immediate attention"
                type="high"
              />

              <RiskSummaryCard
                label="MEDIUM RISK"
                value={mediumRiskCount}
                description="Requires verification"
                type="medium"
              />

              <RiskSummaryCard
                label="LOW RISK"
                value={lowRiskCount}
                description="Within normal indicators"
                type="low"
              />
            </div>

            {/* FILTER PANEL */}
            <div className="mt-6 rounded-xl border border-slate-800 bg-[#101720] p-4 md:p-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <h2 className="text-xs font-semibold tracking-[0.18em] text-slate-300">
                    PROJECT SEARCH
                  </h2>
                </div>

                <p className="text-[11px] text-slate-600">
                  Search the registry and narrow projects using intelligence
                  filters
                </p>
              </div>

              {/* SEARCH */}
              <div className="relative mt-5">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-600">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search project ID, state, district, constituency, category..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-[#0b1016] py-3 pl-11 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-slate-600 transition hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* FILTERS */}
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <FilterSelect
                  value={stateFilter}
                  onChange={setStateFilter}
                  options={[
                    "All States",
                    "Kerala",
                    "Tamil Nadu",
                    "Karnataka",
                    "Maharashtra",
                  ]}
                />

                <FilterSelect
                  value={riskFilter}
                  onChange={setRiskFilter}
                  options={[
                    "All Risk Levels",
                    "High Risk",
                    "Medium Risk",
                    "Low Risk",
                  ]}
                />

                <FilterSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    "All Statuses",
                    "Under Review",
                    "Active",
                    "Completed",
                    "Flagged",
                  ]}
                />

                <FilterSelect
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={[
                    "All Categories",
                    ...Array.from(
                      new Set(
                        projects.map(
                          (project) => project.category
                        )
                      )
                    ),
                  ]}
                />

                <FilterSelect
                  value={sortBy}
                  onChange={(value) =>
                    setSortBy(value as SortOption)
                  }
                  options={[
                    "Risk: High to Low",
                    "Risk: Low to High",
                    "Amount: High to Low",
                    "Amount: Low to High",
                    "Year: Newest",
                    "Year: Oldest",
                    "State: A to Z",
                  ]}
                />
              </div>

              {/* FILTER FOOTER */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-3">
                  <p className="text-xs text-slate-500">
                    Showing{" "}
                    <span className="font-semibold text-slate-300">
                      {filteredProjects.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-300">
                      {projects.length}
                    </span>{" "}
                    loaded projects
                  </p>

                  {hasActiveFilters && (
                    <span className="hidden rounded border border-emerald-900/50 bg-emerald-950/10 px-2 py-1 text-[10px] text-emerald-500 sm:inline-block">
                      FILTERED VIEW
                    </span>
                  )}
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="rounded-md border border-emerald-900/60 px-3 py-2 text-[11px] font-medium tracking-wider text-emerald-400 transition hover:bg-emerald-950/30 hover:text-emerald-300"
                  >
                    RESET ALL FILTERS
                  </button>
                )}
              </div>
            </div>

            {/* PROJECT TABLE */}
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-[#101720]">
              {/* TABLE HEADER */}
              <div className="flex flex-col gap-4 border-b border-slate-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-semibold tracking-wider">
                      PROJECT RECORDS
                    </h2>

                    <span className="rounded border border-emerald-900/60 bg-emerald-950/20 px-2 py-1 text-[10px] text-emerald-400">
                      LIVE VIEW
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-600">
                    Select any project to inspect its intelligence profile
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded border border-slate-700 px-3 py-1.5 text-xs text-slate-500">
                    {filteredProjects.length} RECORDS
                  </span>
                </div>
              </div>
              {/* TABLE */}
              {filteredProjects.length > 0 && (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-left text-sm">
                      <thead className="border-b border-slate-800 bg-[#0d141c] text-[10px] tracking-wider text-slate-500">
                        <tr>
                          <th className="px-6 py-4">PROJECT ID</th>
                          <th className="px-6 py-4">LOCATION</th>
                          <th className="px-6 py-4">CATEGORY</th>
                          <th className="px-6 py-4">AMOUNT</th>
                          <th className="px-6 py-4">STATUS</th>
                          <th className="px-6 py-4">RISK</th>
                          <th className="px-6 py-4">YEAR</th>
                          <th className="px-6 py-4 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map((project) => (
                          <ProjectRow
                            key={project.id}
                            project={project}
                            onInspect={() => setSelectedProject(project)}
                          />
                        ))}
                      </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between border-t border-[#1d2a38] px-4 py-3 sm:px-6 mt-4">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center rounded-md border border-[#1d2a38] bg-[#101720] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-[#1a2332]"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md border border-[#1d2a38] bg-[#101720] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-[#1a2332]"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Showing <span className="font-medium text-white">{((page - 1) * 50) + 1}</span> to{" "}
                        <span className="font-medium text-white">{Math.min(page * 50, totalRecords)}</span> of{" "}
                        <span className="font-medium text-white">{totalRecords.toLocaleString("en-IN")}</span> records
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-[#1d2a38] hover:bg-[#1a2332] focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-[#1d2a38]">
                          Page {page} of {totalPages.toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-[#1d2a38] hover:bg-[#1a2332] focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </>
              )}

              {/* EMPTY STATE */}
              {filteredProjects.length === 0 && (
                <div className="px-6 py-20 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-800 bg-[#0d141c] text-2xl text-slate-600">
                    ⌕
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-300">
                    No matching projects found
                  </p>

                  <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-600">
                    The current search and intelligence filters did not
                    return any registered projects.
                  </p>

                  <button
                    onClick={resetFilters}
                    className="mt-5 rounded-md border border-emerald-900/70 px-4 py-2 text-xs text-emerald-400 transition hover:bg-emerald-950/30"
                  >
                    CLEAR FILTERS
                  </button>
                </div>
              )}

              {/* TABLE FOOTER */}
              {filteredProjects.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-slate-800 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] tracking-wider text-slate-700">
                    MPLADS INTELLIGENCE REGISTRY
                  </p>

                  <p className="text-[10px] text-slate-600">
                    Click a record to inspect project details
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}

/* ---------------------------------------------
   RISK SUMMARY CARD
--------------------------------------------- */

function RiskSummaryCard({
  label,
  value,
  description,
  type,
}: {
  label: string;
  value: number;
  description: string;
  type: "high" | "medium" | "low";
}) {
  const styles = {
    high: {
      dot: "bg-red-400",
      number: "text-red-400",
      border: "border-red-950/70",
    },

    medium: {
      dot: "bg-amber-400",
      number: "text-amber-400",
      border: "border-amber-950/70",
    },

    low: {
      dot: "bg-emerald-400",
      number: "text-emerald-400",
      border: "border-emerald-950/70",
    },
  };

  const current = styles[type];

  return (
    <div
      className={`rounded-xl border ${current.border} bg-[#101720] p-5 transition hover:-translate-y-0.5 hover:bg-[#121b24]`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${current.dot}`}
        />

        <p className="text-[10px] font-medium tracking-[0.2em] text-slate-500">
          {label}
        </p>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <p
          className={`text-2xl font-semibold ${current.number}`}
        >
          {value}
        </p>

        <span className="text-[10px] text-slate-600">
          PROJECTS
        </span>
      </div>

      <p className="mt-2 text-[11px] text-slate-600">
        {description}
      </p>
    </div>
  );
}

/* ---------------------------------------------
   FILTER SELECT
--------------------------------------------- */

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-md border border-slate-700 bg-[#0b1016] px-3 py-3 text-xs text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

/* ---------------------------------------------
   PROJECT ROW
--------------------------------------------- */

function ProjectRow({
  project,
  onInspect,
}: {
  project: Project;
  onInspect: () => void;
}) {
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onInspect();
    }
  };

  return (
    <tr
      tabIndex={0}
      role="button"
      onClick={onInspect}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer border-b border-slate-800/60 outline-none transition hover:bg-slate-800/25 focus:bg-slate-800/25"
    >
      {/* ID */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 opacity-50 transition group-hover:opacity-100" />

          <div>
            <p className="font-mono text-xs text-emerald-400">
              {project.id}
            </p>

            <p className="mt-1 text-[10px] text-slate-700">
              PROJECT RECORD
            </p>
          </div>
        </div>
      </td>

      {/* LOCATION */}
      <td className="px-6 py-5">
        <p className="text-slate-300">
          {project.constituency}
        </p>

        <p className="mt-1 text-xs text-slate-600">
          {project.district}, {project.state}
        </p>
      </td>

      {/* CATEGORY */}
      <td className="px-6 py-5">
        <span className="text-slate-400">
          {project.category}
        </span>
      </td>

      {/* AMOUNT */}
      <td className="px-6 py-5">
        <p className="text-slate-300">
          {formatAmount(project.amount)}
        </p>

        <p className="mt-1 text-[10px] text-slate-700">
          {formatFullAmount(project.amount)}
        </p>
      </td>

      {/* STATUS */}
      <td className="px-6 py-5">
        <StatusBadge status={project.status} />
      </td>

      {/* RISK */}
      <td className="px-6 py-5">
        <RiskBadge risk={project.risk} />
      </td>

      {/* YEAR */}
      <td className="px-6 py-5 text-xs text-slate-500">
        {project.year}
      </td>

      {/* ACTION */}
      <td className="px-6 py-5 text-right">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onInspect();
          }}
          aria-label={`Inspect project ${project.id}`}
          className="rounded-md border border-emerald-900/70 px-3 py-2 text-[10px] font-medium tracking-wider text-emerald-400 transition hover:bg-emerald-950/40 hover:text-emerald-300"
        >
          INSPECT →
        </button>
      </td>
    </tr>
  );
}

/* ---------------------------------------------
   STATUS BADGE
--------------------------------------------- */

function StatusBadge({
  status,
}: {
  status: Project["status"];
}) {
  const styles: Record<Project["status"], string> = {
    "Under Review":
      "border-amber-900/70 bg-amber-950/20 text-amber-400",

    Active:
      "border-emerald-900/70 bg-emerald-950/20 text-emerald-400",

    Completed:
      "border-slate-700 bg-slate-900/50 text-slate-400",

    Flagged:
      "border-red-900/70 bg-red-950/20 text-red-400",
  };

  return (
    <span
      className={`rounded border px-2.5 py-1 text-[10px] ${styles[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}

/* ---------------------------------------------
   RISK BADGE
--------------------------------------------- */

function RiskBadge({ risk }: { risk: number }) {
  const getRiskStyles = () => {
    if (risk >= 90) {
      return {
        wrapper:
          "border-red-900 bg-red-950/40 text-red-400 shadow-[0_0_12px_rgba(248,113,113,0.08)]",
        label: "CRITICAL",
      };
    }

    if (risk >= 80) {
      return {
        wrapper:
          "border-red-900/70 bg-red-950/30 text-red-400",
        label: "HIGH",
      };
    }

    if (risk >= 60) {
      return {
        wrapper:
          "border-amber-900/70 bg-amber-950/30 text-amber-400",
        label: "MEDIUM",
      };
    }

    return {
      wrapper:
        "border-emerald-900/70 bg-emerald-950/30 text-emerald-400",
      label: "LOW",
    };
  };

  const styles = getRiskStyles();

  return (
    <div className="flex items-center gap-2">
      <span
        className={`rounded border px-2 py-1 text-xs font-semibold ${styles.wrapper}`}
      >
        {risk}
      </span>

      <span className="hidden text-[9px] tracking-wider text-slate-600 xl:inline">
        {styles.label}
      </span>
    </div>
  );
}

/* ---------------------------------------------
   PROJECT MODAL
--------------------------------------------- */

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-700 bg-[#101720] shadow-2xl"
      >
        {/* MODAL HEADER */}
        <div className="flex items-start justify-between border-b border-slate-800 p-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />

              <p className="font-mono text-xs text-emerald-400">
                {project.id}
              </p>
            </div>

            <h2
              id="project-modal-title"
              className="mt-3 text-xl font-semibold"
            >
              Project Intelligence Profile
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              {project.constituency}, {project.state}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close project details"
            className="rounded-md px-2 py-1 text-2xl leading-none text-slate-600 transition hover:bg-slate-800 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* RISK BANNER */}
          <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-[#0d141c] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] tracking-[0.2em] text-slate-600">
                CURRENT RISK ASSESSMENT
              </p>

              <p className="mt-2 text-sm text-slate-300">
                Automated anomaly indicators associated with this project
              </p>
            </div>

            <div className="flex items-center gap-3">
              <RiskBadge risk={project.risk} />

              <div className="h-10 w-px bg-slate-800" />

              <p className="text-xs text-slate-600">
                {project.risk >= 80
                  ? "REVIEW REQUIRED"
                  : project.risk >= 60
                    ? "VERIFY"
                    : "MONITOR"}
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <p className="text-[10px] tracking-[0.2em] text-slate-600">
              PROJECT DESCRIPTION
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {project.description}
            </p>
          </div>

          {/* DETAILS */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Detail
              label="STATE"
              value={project.state}
            />

            <Detail
              label="DISTRICT"
              value={project.district}
            />

            <Detail
              label="CONSTITUENCY"
              value={project.constituency}
            />

            <Detail
              label="CATEGORY"
              value={project.category}
            />

            <Detail
              label="ALLOCATED AMOUNT"
              value={formatFullAmount(project.amount)}
            />

            <Detail
              label="STATUS"
              value={project.status}
            />

            <Detail
              label="PROJECT YEAR"
              value={project.year.toString()}
            />

            <Detail
              label="RISK SCORE"
              value={`${project.risk}/100`}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              className="rounded-md border border-slate-700 px-5 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >
              CLOSE
            </button>

            <Link
              href={`/investigation?project=${encodeURIComponent(
                project.id
              )}`}
              className="rounded-md bg-emerald-500 px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]"
            >
              OPEN INVESTIGATION →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   DETAIL CARD
--------------------------------------------- */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-[#0d141c] p-4 transition hover:border-slate-700">
      <p className="text-[9px] tracking-[0.18em] text-slate-600">
        {label}
      </p>

      <p className="mt-2 text-sm text-slate-300">
        {value}
      </p>
    </div>
  );
}