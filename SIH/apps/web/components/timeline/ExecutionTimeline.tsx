'use client';

import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Hourglass,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  ShieldAlert,
} from 'lucide-react';
import { TimelineStep, TimelineStepStatus } from '../../types/investigation';

interface ExecutionTimelineProps {
  timeline: TimelineStep[];
  sanctionedAmount: number;
  releasedAmount: number;
  physicalProgress: number;
  financialProgress: number;
}

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({
  timeline,
  physicalProgress,
  financialProgress,
}) => {
  const [selectedStepId, setSelectedStepId] = useState<string | null>('TL-04');
  const [showLogs, setShowLogs] = useState<boolean>(true);

  const progressGap = financialProgress - physicalProgress;
  const isSevereDivergence = progressGap >= 50;

  const getStatusBadge = (status: TimelineStepStatus, isAnomalous: boolean) => {
    if (isAnomalous || status === 'ANOMALOUS') {
      return {
        label: 'FLAGGED ANOMALY',
        badgeClass: 'bg-amber-950/40 text-amber-400 border-amber-900',
        dotClass: 'bg-amber-400',
        icon: <AlertOctagon className="h-4 w-4 text-amber-400" />,
      };
    }
    switch (status) {
      case 'COMPLETED':
        return {
          label: 'CLEARED',
          badgeClass: 'bg-emerald-950/40 text-emerald-400 border-emerald-900',
          dotClass: 'bg-emerald-400',
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
        };
      case 'IN_PROGRESS':
        return {
          label: 'IN PROGRESS',
          badgeClass: 'bg-slate-800/60 text-slate-200 border-slate-700',
          dotClass: 'bg-white',
          icon: <Hourglass className="h-4 w-4 text-white" />,
        };
      case 'DELAYED':
        return {
          label: 'SLA DELAYED',
          badgeClass: 'bg-amber-950/20 text-amber-300 border-amber-900/40',
          dotClass: 'bg-amber-400',
          icon: <Clock className="h-4 w-4 text-amber-400" />,
        };
      case 'PENDING':
      default:
        return {
          label: 'PENDING',
          badgeClass: 'bg-[#0b1016] text-slate-500 border-slate-800',
          dotClass: 'bg-slate-700',
          icon: <Clock className="h-4 w-4 text-slate-500" />,
        };
    }
  };

  const selectedStep = timeline.find((s) => s.stepId === selectedStepId) || timeline[0];

  return (
    <div className="rounded-lg border border-slate-800 bg-[#101720] overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-6 py-4 bg-[#0b1016]">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md border ${
            isSevereDivergence
              ? 'border-amber-900/60 bg-amber-950/40 text-amber-400'
              : 'border-emerald-900 bg-emerald-950/40 text-emerald-400'
          }`}>
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold tracking-wider text-white">
                EXECUTION LIFECYCLE & DISBURSAL TIMELINE
              </h3>
              {isSevereDivergence && (
                <span className="rounded border border-amber-900 bg-amber-950/40 px-2.5 py-0.5 text-xs text-amber-400 font-medium flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {progressGap}% DISBURSAL GAP
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Chronological workflow tracking statutory turnaround times, disbursals, and inspection logs
            </p>
          </div>
        </div>

        {/* Dual Progress Indicators */}
        <div className="flex items-center gap-4 bg-[#101720] border border-slate-800 px-4 py-2 rounded-md text-xs font-mono">
          <div className="space-y-1 text-right">
            <div className="flex items-center justify-end gap-1.5 text-[10px]">
              <span className="text-slate-500">DISBURSED:</span>
              <span className="text-amber-400 font-semibold">{financialProgress}%</span>
            </div>
            <div className="w-24 h-1.5 bg-[#0b1016] rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400"
                style={{ width: `${Math.min(financialProgress, 100)}%` }}
              />
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <div className="space-y-1 text-right">
            <div className="flex items-center justify-end gap-1.5 text-[10px]">
              <span className="text-slate-500">PHYSICAL:</span>
              <span className="text-emerald-400 font-semibold">{physicalProgress}%</span>
            </div>
            <div className="w-24 h-1.5 bg-[#0b1016] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400"
                style={{ width: `${Math.min(physicalProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Critical Anomaly Callout */}
        {isSevereDivergence && (
          <div className="rounded-lg p-4 border border-amber-900/60 bg-amber-950/30 text-xs text-amber-200 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-400 tracking-wider uppercase text-xs">
                CRITICAL INVERSION: 100% FUND DISBURSAL VS 12% PHYSICAL GROUND PROGRESS
              </p>
              <p className="text-slate-300 leading-relaxed text-xs">
                Full 100% funds were drawn from treasury at Stage 3, yet on-site physical progress
                is verified at only 12% with multiple mandatory quarterly progress reports overdue.
              </p>
            </div>
          </div>
        )}

        {/* Step Flow Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {timeline.map((step, idx) => {
            const statusCfg = getStatusBadge(step.status, step.isAnomalous);
            const isSelected = selectedStepId === step.stepId;

            return (
              <button
                key={step.stepId}
                onClick={() => setSelectedStepId(step.stepId)}
                className={`text-left p-3.5 rounded-md border transition ${
                  isSelected
                    ? 'bg-[#0b1016] border-emerald-500 ring-1 ring-emerald-500/40'
                    : step.isAnomalous
                    ? 'bg-[#0b1016] border-amber-900/50 hover:bg-slate-800/40'
                    : 'bg-[#0b1016] border-slate-800 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    STAGE 0{idx + 1}
                  </span>
                  <span className={`h-2 w-2 rounded-full ${statusCfg.dotClass}`} />
                </div>

                <h4 className="text-xs font-semibold text-white line-clamp-1">
                  {step.title}
                </h4>

                <div className="mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${statusCfg.badgeClass}`}>
                    {statusCfg.label}
                  </span>
                </div>

                <div className="mt-3 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                  <span>{step.actualDate || step.plannedDate}</span>
                  {step.deltaDays > 0 ? (
                    <span className="text-amber-400 font-semibold">+{step.deltaDays}d</span>
                  ) : (
                    <span className="text-emerald-400 font-semibold">{step.deltaDays}d</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detailed Record */}
        {selectedStep && (
          <div className="rounded-lg border border-slate-800 bg-[#0b1016] p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="rounded px-2.5 py-1 bg-[#101720] border border-slate-700 text-xs font-mono text-emerald-400 font-medium">
                  {selectedStep.stepId}
                </span>
                <h4 className="text-sm font-semibold text-white">
                  {selectedStep.title} — Detailed Inspection Record
                </h4>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                <span>STATUTORY SLA: <strong className="text-slate-300">{selectedStep.standardSlaDays} DAYS</strong></span>
                <span>ELAPSED: <strong className={selectedStep.elapsedDays > selectedStep.standardSlaDays ? 'text-amber-400' : 'text-slate-300'}>{selectedStep.elapsedDays} DAYS</strong></span>
              </div>
            </div>

            {selectedStep.isAnomalous && selectedStep.anomalyTitle && (
              <div className="p-3 rounded-md border border-amber-900/60 bg-amber-950/20 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <ShieldAlert className="h-4 w-4 text-amber-400" />
                  <span>{selectedStep.anomalyTitle}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedStep.anomalyDescription}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#101720] rounded-md border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">SCHEDULED DATE</span>
                <span className="text-slate-200 font-medium mt-1 block">{selectedStep.plannedDate}</span>
              </div>
              <div className="p-3 bg-[#101720] rounded-md border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">ACTUAL DATE</span>
                <span className="text-slate-200 font-medium mt-1 block">{selectedStep.actualDate || 'PENDING'}</span>
              </div>
              <div className="p-3 bg-[#101720] rounded-md border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">DISBURSED</span>
                <span className="text-amber-400 font-semibold mt-1 block">{selectedStep.disbursedPercentCumulative}%</span>
              </div>
              <div className="p-3 bg-[#101720] rounded-md border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">GROUND PROGRESS</span>
                <span className="text-emerald-400 font-semibold mt-1 block">{selectedStep.physicalProgressPercentCumulative}%</span>
              </div>
            </div>

            {selectedStep.logs && selectedStep.logs.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                    TRANSACTION & SENTRY VERIFICATION LOGS ({selectedStep.logs.length})
                  </span>
                  <button
                    onClick={() => setShowLogs(!showLogs)}
                    className="text-emerald-400 hover:underline flex items-center gap-1 text-xs"
                  >
                    <span>{showLogs ? 'COLLAPSE' : 'EXPAND'}</span>
                    {showLogs ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {showLogs && (
                  <div className="space-y-2 pt-1">
                    {selectedStep.logs.map((log, lIdx) => (
                      <div
                        key={lIdx}
                        className={`p-3 rounded-md border text-xs flex items-start gap-3 ${
                          log.severity === 'CRITICAL'
                            ? 'bg-red-950/20 border-red-900/60 text-red-300'
                            : log.severity === 'WARNING'
                            ? 'bg-amber-950/20 border-amber-900/40 text-amber-300'
                            : 'bg-[#101720] border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-[11px] font-mono text-slate-500 shrink-0 mt-0.5">
                          {log.date}
                        </span>
                        <div className="flex-1 space-y-0.5">
                          <p className="font-medium text-white text-xs">{log.event}</p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            LOGGED BY: {log.recordedBy}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded border ${
                            log.severity === 'CRITICAL'
                              ? 'bg-red-950 border-red-900 text-red-400'
                              : log.severity === 'WARNING'
                              ? 'bg-amber-950 border-amber-900 text-amber-400'
                              : 'bg-[#0b1016] border-slate-800 text-slate-400'
                          }`}
                        >
                          {log.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionTimeline;
