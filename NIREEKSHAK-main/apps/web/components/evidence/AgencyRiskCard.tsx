'use client';

import React from 'react';
import {
  Building,
  ShieldAlert,
} from 'lucide-react';
import { AgencyRiskEvidence } from '../../types/investigation';

interface AgencyRiskCardProps {
  evidence: AgencyRiskEvidence;
}

export const AgencyRiskCard: React.FC<AgencyRiskCardProps> = ({ evidence }) => {
  const {
    agencyName,
    contractorName,
    activeProjectsInBlockCount,
    totalWorksSanctionedCount,
    flaggedProjectsCount,
    allocationSharePercentInBlock,
    averageExecutionDelayDays,
    utilizationCertificatesPendingCount,
    riskRating,
  } = evidence || {};

  const isHighRisk = riskRating === 'HIGH' || riskRating === 'ELEVATED';

  return (
    <div className="rounded-lg border border-slate-800 bg-[#101720] overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-6 py-4 bg-[#0b1016]">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md border ${
            isHighRisk
              ? 'border-amber-900/60 bg-amber-950/40 text-amber-400'
              : 'border-emerald-900 bg-emerald-950/40 text-emerald-400'
          }`}>
            <Building className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold tracking-wider text-white">
                AGENCY & CONCENTRATION RISK
              </h3>
              <span className={`rounded border px-2.5 py-0.5 text-xs font-medium ${
                isHighRisk
                  ? 'border-amber-900 bg-amber-950/40 text-amber-400'
                  : 'border-emerald-900 bg-emerald-950/40 text-emerald-400'
              }`}>
                {riskRating} EXPOSURE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate max-w-xl">
              {agencyName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500">CONTRACTOR:</span>
          <span className="text-white font-medium">{contractorName}</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Metric Blocks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card 1 */}
          <div className="p-3.5 bg-[#0b1016] rounded-md border border-slate-800 space-y-1">
            <span className="text-xs text-slate-500 block">BLOCK ALLOCATION SHARE</span>
            <div className="text-2xl font-semibold text-amber-400">
              {allocationSharePercentInBlock}%
            </div>
            <p className="text-[11px] text-slate-500">Elevated concentration in block</p>
          </div>

          {/* Card 2 */}
          <div className="p-3.5 bg-[#0b1016] rounded-md border border-slate-800 space-y-1">
            <span className="text-xs text-slate-500 block">FLAGGED WORKS</span>
            <div className="text-2xl font-semibold text-amber-400">
              {flaggedProjectsCount} <span className="text-xs font-normal text-slate-500">/ {totalWorksSanctionedCount}</span>
            </div>
            <p className="text-[11px] text-amber-400/80">19% portfolio anomaly rate</p>
          </div>

          {/* Card 3 */}
          <div className="p-3.5 bg-[#0b1016] rounded-md border border-slate-800 space-y-1">
            <span className="text-xs text-slate-500 block">AVG EXECUTION DELAY</span>
            <div className="text-2xl font-semibold text-white">
              +{averageExecutionDelayDays} <span className="text-xs font-normal text-slate-500">days</span>
            </div>
            <p className="text-[11px] text-slate-500">Past SLA statutory baseline</p>
          </div>

          {/* Card 4 */}
          <div className="p-3.5 bg-[#0b1016] rounded-md border border-slate-800 space-y-1">
            <span className="text-xs text-slate-500 block">PENDING UCs</span>
            <div className="text-2xl font-semibold text-amber-400">
              {utilizationCertificatesPendingCount} <span className="text-xs font-normal text-slate-500">overdue</span>
            </div>
            <p className="text-[11px] text-slate-500">Utilization certs pending</p>
          </div>
        </div>

        {/* Agency Risk Warning */}
        <div className="p-3.5 bg-[#0b1016] rounded-md border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              Agency holds <strong className="text-white">{activeProjectsInBlockCount} active works</strong> in block with elevated turnaround latency.
            </span>
          </div>
          <span className="text-[10px] text-slate-500 uppercase shrink-0 font-mono">
            CLUSTER RISK: 78/100
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgencyRiskCard;
