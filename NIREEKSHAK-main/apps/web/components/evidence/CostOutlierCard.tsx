'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  BarChart3,
  Scale,
  Info,
  Building2,
  FileSpreadsheet,
} from 'lucide-react';
import { CostOutlierEvidence } from '../../types/investigation';
import { formatINR } from '../../lib/sihMockData';

interface CostOutlierCardProps {
  evidence: CostOutlierEvidence;
  projectSanctionedAmount: number;
}

export const CostOutlierCard: React.FC<CostOutlierCardProps> = ({
  evidence,
  projectSanctionedAmount,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'components' | 'statistics'>('components');

  const {
    thisProjectCost,
    unitMetric,
    unitValue,
    unitCost,
    peerUnitCostMedian,
    peerMedianCost,
    peerIqrLow,
    peerIqrHigh,
    peerP95,
    peerMin,
    peerMax,
    deviationMultiplier = 1,
    zScore = 0,
    peerSampleSize,
    baselineCategory,
    costBreakdown,
    statisticalObservations,
  } = evidence;

  const rangeSpan = Math.max(peerMax, thisProjectCost) * 1.1 - peerMin;
  const getPercent = (val: number) => {
    const raw = ((val - peerMin) / rangeSpan) * 100;
    return Math.min(Math.max(raw, 2), 98);
  };

  const q1Pos = getPercent(peerIqrLow);
  const medianPos = getPercent(peerMedianCost);
  const q3Pos = getPercent(peerIqrHigh);
  const p95Pos = getPercent(peerP95);
  const thisProjectPos = getPercent(thisProjectCost);

  const isHighAnomaly = deviationMultiplier >= 1.75;
  const isModerateAnomaly = deviationMultiplier >= 1.3 && deviationMultiplier < 1.75;

  return (
    <div className="rounded-lg border border-slate-800 bg-[#101720] overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-6 py-4 bg-[#0b1016]">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md border ${
            isHighAnomaly
              ? 'border-amber-900/60 bg-amber-950/40 text-amber-400'
              : isModerateAnomaly
              ? 'border-amber-900/40 bg-amber-950/20 text-amber-400'
              : 'border-emerald-900 bg-emerald-950/40 text-emerald-400'
          }`}>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold tracking-wider text-white">
                COST OUTLIER & BENCHMARK ANALYSIS
              </h3>
              <span className={`rounded border px-2.5 py-0.5 text-xs font-medium ${
                isHighAnomaly
                  ? 'border-amber-900 bg-amber-950/40 text-amber-400'
                  : 'border-emerald-900 bg-emerald-950/40 text-emerald-400'
              }`}>
                {deviationMultiplier}x PEER MEDIAN
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Empirical cost comparison against {peerSampleSize} peer projects under CPWD / State Schedule of Rates
            </p>
          </div>
        </div>

        {/* Statistical Flag Chip & Drawer Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#101720] border border-slate-800 text-xs font-mono">
            <span className="text-slate-500">Z-SCORE:</span>
            <span className={zScore > 3 ? 'text-amber-400 font-semibold' : 'text-slate-300 font-semibold'}>
              +{zScore.toFixed(2)}σ
            </span>
          </div>
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-300 bg-[#0b1016] hover:bg-slate-800 rounded-md border border-slate-700 transition"
            aria-expanded={isDrawerOpen}
          >
            <BarChart3 className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isDrawerOpen ? 'HIDE EVIDENCE' : 'VIEW EVIDENCE'}</span>
            {isDrawerOpen ? <ChevronUp className="h-3.5 w-3.5 text-slate-500" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Card 1: Subject Project Cost */}
          <div className="p-4 rounded-md border border-slate-800 bg-[#0b1016] space-y-1">
            <p className="text-xs text-slate-500">SANCTIONED COST</p>
            <p className="text-2xl font-semibold text-amber-400">
              {formatINR(thisProjectCost || projectSanctionedAmount)}
            </p>
            <p className="text-xs text-amber-400/80 flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3 inline" />
              <span>Severe Outlier</span>
            </p>
          </div>

          {/* Card 2: Peer Median */}
          <div className="p-4 rounded-md border border-slate-800 bg-[#0b1016] space-y-1">
            <p className="text-xs text-slate-500">PEER MEDIAN (50th %ile)</p>
            <p className="text-2xl font-semibold text-white">
              {formatINR(peerMedianCost)}
            </p>
            <p className="text-xs text-slate-500 font-mono">
              IQR: {formatINR(peerIqrLow)} – {formatINR(peerIqrHigh)}
            </p>
          </div>

          {/* Card 3: Deviation Factor */}
          <div className="p-4 rounded-md border border-slate-800 bg-[#0b1016] space-y-1">
            <p className="text-xs text-slate-500">DEVIATION FACTOR</p>
            <p className="text-2xl font-semibold text-amber-400">
              +{Math.round((deviationMultiplier - 1) * 100)}%
            </p>
            <p className="text-xs text-slate-500">
              {deviationMultiplier.toFixed(2)}x regional baseline
            </p>
          </div>

          {/* Card 4: Unit Cost Rate */}
          <div className="p-4 rounded-md border border-slate-800 bg-[#0b1016] space-y-1">
            <p className="text-xs text-slate-500">UNIT RATE ({unitMetric.split(' ')[0]})</p>
            <p className="text-2xl font-semibold text-white">
              ₹ {unitCost.toLocaleString('en-IN')}<span className="text-xs text-slate-500 font-normal">/m²</span>
            </p>
            <p className="text-xs text-slate-500">
              SoR Baseline: ₹ {peerUnitCostMedian.toLocaleString('en-IN')}/m²
            </p>
          </div>
        </div>

        {/* Visual Distribution Range Box-Plot Bar */}
        <div className="rounded-lg border border-slate-800 bg-[#0b1016] p-5 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-2 tracking-wider uppercase">
              <Scale className="h-4 w-4 text-emerald-400" />
              REGIONAL TENDER DISTRIBUTION & OUTLIER POSITION
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              SAMPLE SIZE N = {peerSampleSize} WORKS
            </span>
          </div>

          {/* Range Track */}
          <div className="relative pt-6 pb-8 px-2">
            <div className="h-3 w-full bg-[#101720] rounded-full border border-slate-800 relative overflow-hidden">
              {/* Normal Interquartile Range (Q1 - Q3) */}
              <div
                className="absolute top-0 bottom-0 bg-emerald-950/60 border-x border-emerald-500/50"
                style={{
                  left: `${q1Pos}%`,
                  width: `${Math.max(q3Pos - q1Pos, 4)}%`,
                }}
                title="Normal Range (25th - 75th Percentile)"
              />
              {/* Upper 95th Percentile Region */}
              <div
                className="absolute top-0 bottom-0 bg-amber-950/60 border-r border-amber-500/50"
                style={{
                  left: `${q3Pos}%`,
                  width: `${Math.max(p95Pos - q3Pos, 2)}%`,
                }}
                title="Elevated Variance (75th - 95th Percentile)"
              />
              {/* Extreme Anomaly Region */}
              <div
                className="absolute top-0 bottom-0 bg-red-950/60"
                style={{
                  left: `${p95Pos}%`,
                  right: 0,
                }}
                title="Severe Outlier Zone (> 95th Percentile)"
              />
            </div>

            {/* Q1 Marker */}
            <div
              className="absolute top-3 -translate-x-1/2 flex flex-col items-center pointer-events-none"
              style={{ left: `${q1Pos}%` }}
            >
              <div className="h-4 w-px bg-slate-700" />
              <span className="text-[9px] font-mono text-slate-500 mt-1">Q1 ({formatINR(peerIqrLow)})</span>
            </div>

            {/* Median Marker */}
            <div
              className="absolute top-3 -translate-x-1/2 flex flex-col items-center pointer-events-none"
              style={{ left: `${medianPos}%` }}
            >
              <div className="h-4 w-px bg-emerald-400" />
              <span className="text-[9px] font-mono text-emerald-400 font-semibold mt-1">
                MEDIAN ({formatINR(peerMedianCost)})
              </span>
            </div>

            {/* Q3 Marker */}
            <div
              className="absolute top-3 -translate-x-1/2 flex flex-col items-center pointer-events-none"
              style={{ left: `${q3Pos}%` }}
            >
              <div className="h-4 w-px bg-slate-700" />
              <span className="text-[9px] font-mono text-slate-500 mt-1">Q3 ({formatINR(peerIqrHigh)})</span>
            </div>

            {/* 95th Percentile Marker */}
            <div
              className="absolute top-3 -translate-x-1/2 flex flex-col items-center pointer-events-none"
              style={{ left: `${p95Pos}%` }}
            >
              <div className="h-4 w-px bg-amber-400" />
              <span className="text-[9px] font-mono text-amber-400 mt-1">P95 ({formatINR(peerP95)})</span>
            </div>

            {/* Subject Project Marker (Flag Pin) */}
            <div
              className="absolute -top-1 -translate-x-1/2 flex flex-col items-center z-10"
              style={{ left: `${thisProjectPos}%` }}
            >
              <div className="px-2 py-0.5 rounded border border-amber-900 bg-amber-950 text-amber-400 font-mono text-[10px] font-semibold">
                SUBJECT: {formatINR(thisProjectCost)}
              </div>
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-amber-500" />
              <div className="h-4 w-px bg-amber-400" />
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Normal IQR Range</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Elevated Variance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span>Severe Anomaly</span>
              </div>
            </div>
            <div className="font-mono text-[11px] text-slate-600">
              UPPER BOUND: {formatINR(peerIqrHigh * 1.5)}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Forensic Evidence Drawer */}
      {isDrawerOpen && (
        <div className="border-t border-slate-800 bg-[#0b1016] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('components')}
                className={`px-3 py-1.5 text-xs rounded-md transition ${
                  activeTab === 'components'
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span>ITEMIZED DISCREPANCIES</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('statistics')}
                className={`px-3 py-1.5 text-xs rounded-md transition ${
                  activeTab === 'statistics'
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  <span>BASELINE SPECIFICATIONS</span>
                </div>
              </button>
            </div>

            <span className="text-[10px] font-mono text-slate-500">
              REF: CPWD / STATE SCHEDULE OF RATES
            </span>
          </div>

          {activeTab === 'components' && (
            <div className="overflow-x-auto rounded-md border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-800 bg-[#101720] text-xs text-slate-500">
                  <tr>
                    <th className="px-4 py-3">WORK COMPONENT</th>
                    <th className="px-4 py-3 text-right">SANCTIONED AMOUNT</th>
                    <th className="px-4 py-3 text-right">PEER SoR BENCHMARK</th>
                    <th className="px-4 py-3 text-right">VARIANCE</th>
                    <th className="px-4 py-3">AUDIT NOTE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {costBreakdown.map((item, idx) => (
                    <tr
                      key={idx}
                      className={item.anomalyFlag ? 'bg-amber-950/10' : 'bg-transparent'}
                    >
                      <td className="px-4 py-3 text-slate-300 font-sans font-medium flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${item.anomalyFlag ? 'bg-amber-400' : 'bg-slate-600'}`} />
                        {item.component}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-white">
                        {formatINR(item.projectCost)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400">
                        {formatINR(item.peerAverageCost)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                            item.deviationPercent > 100
                              ? 'bg-amber-950/40 text-amber-400 border-amber-900'
                              : item.deviationPercent > 40
                              ? 'bg-amber-950/20 text-amber-300 border-amber-900/50'
                              : 'bg-emerald-950/40 text-emerald-400 border-emerald-900'
                          }`}
                        >
                          +{item.deviationPercent.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-sans text-xs">
                        {item.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 rounded-md bg-[#101720] border border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-400" />
                  BASELINE CATEGORY SPECIFICATION
                </h4>
                <div className="text-xs text-slate-400 space-y-1.5 pt-1">
                  <div><span className="text-slate-500">CATEGORY:</span> {baselineCategory}</div>
                  <div><span className="text-slate-500">BUILT-UP AREA:</span> {unitValue} sq. metres</div>
                  <div><span className="text-slate-500">DISTRICT MEDIAN:</span> {formatINR(evidence.districtMedian)}</div>
                  <div><span className="text-slate-500">STATE MEDIAN:</span> {formatINR(evidence.stateMedian)}</div>
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-md bg-[#101720] border border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Info className="h-4 w-4 text-emerald-400" />
                  STATISTICAL RULES TRIGGERED
                </h4>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  {statisticalObservations.map((obs, i) => (
                    <li key={i} className="text-slate-300">{obs}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CostOutlierCard;
