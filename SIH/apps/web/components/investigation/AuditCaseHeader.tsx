'use client';

import React from 'react';
import {
  Printer,
  Share2,
  AlertOctagon,
  Calendar,
  Building,
  User,
  MapPin,
  CheckCircle2,
  Sparkles,
  Flame,
} from 'lucide-react';
import { ProjectHeader, RiskAssessment, RiskLevel } from '../../types/investigation';

interface AuditCaseHeaderProps {
  header: ProjectHeader;
  risk: RiskAssessment;
  onExportPDF?: () => void;
}

export const AuditCaseHeader: React.FC<AuditCaseHeaderProps> = ({
  header,
  risk,
  onExportPDF,
}) => {
  const getRiskBadgeDetails = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          label: 'CRITICAL ANOMALY',
          sublabel: 'Immediate Technical Inquiry & Vigilance Referral',
          containerClass: 'border-red-900 bg-red-950/40 text-red-400',
          scoreColor: 'text-red-400',
          badgeClass: 'border-red-900 bg-red-950/40 text-red-400',
          icon: <Flame className="h-5 w-5 text-red-400 shrink-0" />,
        };
      case 'HIGH':
        return {
          label: 'HIGH-RISK ANOMALY',
          sublabel: 'Mandatory Technical Verification & Field Audit',
          containerClass: 'border-amber-900/60 bg-amber-950/30 text-amber-400',
          scoreColor: 'text-amber-400',
          badgeClass: 'border-amber-900 bg-amber-950/40 text-amber-400',
          icon: <AlertOctagon className="h-5 w-5 text-amber-400 shrink-0" />,
        };
      case 'MEDIUM':
        return {
          label: 'POTENTIAL IRREGULARITY',
          sublabel: 'Secondary Administrative Clarification Required',
          containerClass: 'border-amber-900/40 bg-amber-950/20 text-amber-400',
          scoreColor: 'text-amber-400',
          badgeClass: 'border-amber-900/50 bg-amber-950/30 text-amber-400',
          icon: <AlertOctagon className="h-5 w-5 text-amber-400 shrink-0" />,
        };
      case 'LOW':
      default:
        return {
          label: 'STANDARD PROFILE',
          sublabel: 'Conforms to Statutory PWD / SoR Baselines',
          containerClass: 'border-emerald-900 bg-emerald-950/40 text-emerald-400',
          scoreColor: 'text-emerald-400',
          badgeClass: 'border-emerald-900 bg-emerald-950/40 text-emerald-400',
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
        };
    }
  };

  const riskCfg = getRiskBadgeDetails(risk.riskLevel);

  return (
    <div className="rounded-lg border border-slate-800 bg-[#101720] overflow-hidden">
      {/* Top Directorate Sub-Header */}
      <div className="border-b border-slate-800 bg-[#0b1016] px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="font-semibold tracking-[0.2em] text-white uppercase text-[11px]">
            GOVERNMENT OF INDIA • MPLADS AUDIT DIRECTORATE
          </span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-500 text-[11px] hidden sm:inline">NATIONAL INFORMATICS CENTRE</span>
        </div>

        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
          <span className="rounded border border-slate-800 px-2 py-0.5 bg-[#101720] text-slate-300 font-mono">
            CASE #{header.projectId}
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-emerald-400 font-medium">● ACTIVE INVESTIGATION</span>
        </div>
      </div>

      {/* Main Metadata Section */}
      <div className="p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left Column: Project Attributes */}
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded border border-slate-700 bg-[#0b1016] px-2.5 py-1 text-white font-mono font-medium">
                {header.projectId}
              </span>
              <span className="rounded border border-slate-800 bg-[#0b1016] px-2.5 py-1 text-slate-300">
                {header.sector}
              </span>
              <span className="rounded border border-slate-800 bg-[#0b1016] px-2.5 py-1 text-slate-500">
                FY {header.sanctionYear}
              </span>
              <span className="rounded border border-emerald-900/60 bg-emerald-950/30 px-2.5 py-1 text-emerald-400 text-xs font-medium">
                STATUS: {header.currentStatus.replace(/_/g, ' ')}
              </span>
            </div>

            <div>
              <p className="text-xs tracking-wider text-slate-500 uppercase font-medium">
                SANCTIONED WORK DESCRIPTION
              </p>
              <h1 className="text-2xl font-semibold text-white tracking-tight mt-1 leading-snug">
                {header.title}
              </h1>
            </div>

            {/* Dense Administrative Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="rounded-md border border-slate-800 bg-[#0b1016] p-3 space-y-1">
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" /> CONSTITUENCY
                </p>
                <p className="font-medium text-white text-sm truncate">
                  {header.constituency}
                </p>
              </div>

              <div className="rounded-md border border-slate-800 bg-[#0b1016] p-3 space-y-1">
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-emerald-400" /> RECOMMENDING MP
                </p>
                <p className="font-medium text-white text-sm truncate" title={header.mpName}>
                  {header.mpName}
                </p>
              </div>

              <div className="rounded-md border border-slate-800 bg-[#0b1016] p-3 space-y-1">
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" /> SANCTION DATE
                </p>
                <p className="font-medium text-white text-sm">
                  {header.sanctionDate}
                </p>
              </div>

              <div className="rounded-md border border-slate-800 bg-[#0b1016] p-3 space-y-1">
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-emerald-400" /> IMPLEMENTING AGENCY
                </p>
                <p className="font-medium text-white text-sm truncate" title={header.implementingAgency}>
                  {header.implementingAgency}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Risk Assessment Callout */}
          <div className="flex flex-col items-stretch lg:items-end gap-3 shrink-0">
            <div className={`rounded-lg border p-5 bg-[#0b1016] flex items-center gap-4 min-w-[280px] ${riskCfg.containerClass}`}>
              <div className="rounded-md border border-slate-800 bg-[#101720] h-14 w-14 flex flex-col items-center justify-center shrink-0">
                <span className={`text-3xl font-semibold leading-none ${riskCfg.scoreColor}`}>
                  {risk.overallScore}
                </span>
                <span className="text-[9px] text-slate-500 mt-1">/ 100</span>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold tracking-wider uppercase text-white">
                  {riskCfg.label}
                </div>
                <p className="text-xs text-slate-400 leading-tight">
                  {riskCfg.sublabel}
                </p>
                <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-2 font-mono">
                  <span>CONFIDENCE: <strong className="text-slate-300">{Math.round(risk.confidenceScore * 100)}%</strong></span>
                  <span>•</span>
                  <span>{risk.flaggedRulesCount} ANOMALIES</span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-2 justify-end w-full">
              <button
                onClick={onExportPDF || (() => window.print())}
                className="rounded-md border border-slate-700 bg-[#0b1016] hover:bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 transition flex items-center gap-2"
              >
                <Printer className="h-3.5 w-3.5 text-emerald-400" />
                <span>PRINT DOSSIER</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Case dossier link copied to clipboard.');
                }}
                className="rounded-md border border-slate-700 bg-[#0b1016] hover:bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 transition flex items-center gap-2"
              >
                <Share2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>SHARE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Explainability Primary Drivers */}
        <div className="rounded-lg border border-slate-800 bg-[#0b1016] p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="tracking-wider uppercase text-emerald-400 flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              PRIMARY ANOMALY DRIVERS DETECTED BY NIREEKSHAK:
            </span>
            <span className="text-[10px] text-slate-500 font-mono">ENGINE v2.4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {risk.primaryDrivers.map((driver, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-300 bg-[#101720] p-3 rounded-md border border-slate-800/80"
              >
                <span className="rounded border border-slate-700 bg-[#0b1016] px-1.5 py-0.5 text-[10px] font-mono text-emerald-400 shrink-0 font-medium">
                  0{idx + 1}
                </span>
                <span className="leading-relaxed">{driver}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditCaseHeader;
