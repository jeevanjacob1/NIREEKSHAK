'use client';

import React, { useState } from 'react';
import {
  Copy,
  AlertTriangle,
  MapPin,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Split,
  Eye,
} from 'lucide-react';
import { DuplicateMatchEvidence } from '../../types/investigation';
import { formatINR } from '../../lib/mockData';

interface DuplicateSimilarityPanelProps {
  evidence: DuplicateMatchEvidence;
  currentProjectId: string;
  currentTitle: string;
  currentSanctionDate: string;
  currentSanctionAmount: number;
  currentAgency: string;
  currentLocationName: string;
}

export const DuplicateSimilarityPanel: React.FC<DuplicateSimilarityPanelProps> = ({
  evidence,
  currentProjectId,
  currentTitle,
  currentSanctionDate,
  currentSanctionAmount,
  currentAgency,
  currentLocationName,
}) => {
  const [viewMode, setViewMode] = useState<'tokens' | 'phrases' | 'details'>('tokens');

  const {
    matchScorePercent,
    semanticMatchScore,
    syntacticMatchScore,
    matchedProjectId,
    matchedProjectTitle,
    matchedSanctionDate,
    matchedSanctionAmount,
    matchedImplementingAgency,
    matchedLocationName,
    distanceMeters,
    timeDeltaDays,
    isSameImplementingAgency,
    matchedPhrases,
    currentDescriptionTokens,
    matchedDescriptionTokens,
    riskObservations,
  } = evidence;

  const isHighMatch = matchScorePercent >= 80;

  return (
    <div className="rounded-lg border border-slate-800 bg-[#101720] overflow-hidden">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-6 py-4 bg-[#0b1016]">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md border ${
            isHighMatch
              ? 'border-amber-900/60 bg-amber-950/40 text-amber-400'
              : 'border-emerald-900 bg-emerald-950/40 text-emerald-400'
          }`}>
            <Copy className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold tracking-wider text-white">
                DUPLICATE ASSET & TEXT SIMILARITY
              </h3>
              <span className={`rounded border px-2.5 py-0.5 text-xs font-medium ${
                isHighMatch
                  ? 'border-amber-900 bg-amber-950/40 text-amber-400'
                  : 'border-emerald-900 bg-emerald-950/40 text-emerald-400'
              }`}>
                {matchScorePercent}% SEMANTIC OVERLAP
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              NLP semantic matching cross-referenced with GIS spatial proximity
            </p>
          </div>
        </div>

        {/* Proximity & Time Delta Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#101720] border border-slate-800 text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-500">DISTANCE:</span>
            <span className="text-amber-400 font-semibold">{distanceMeters} m</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#101720] border border-slate-800 text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-slate-500">TIME GAP:</span>
            <span className="text-slate-200 font-semibold">{timeDeltaDays} days</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Alert Banner if Same Agency and Low Distance */}
        {isSameImplementingAgency && distanceMeters <= 500 && (
          <div className="rounded-lg p-4 border border-amber-900/60 bg-amber-950/30 text-xs text-amber-200 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-400 uppercase tracking-wider text-xs">
                HIGH-RISK DUPLICATE ASSET FLAG:
              </p>
              <p className="text-slate-300 leading-relaxed text-xs">
                Both works are allocated to the same implementing agency (<span className="font-semibold text-white">{currentAgency}</span>) 
                within <span className="font-semibold text-amber-400">{distanceMeters} metres</span> of each other. 
                Physical ground survey is mandated to verify if two discrete structures exist or if a single asset is multi-billed.
              </p>
            </div>
          </div>
        )}

        {/* Side-by-Side Project Dossier Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Current Project */}
          <div className="rounded-md border border-slate-800 bg-[#0b1016] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="rounded px-2 py-0.5 bg-emerald-950/40 border border-emerald-900/60 text-[10px] font-medium text-emerald-400">
                  ACTIVE CASE FILE
                </span>
                <span className="font-mono text-xs text-white font-medium">
                  {currentProjectId}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">SUBJECT PROPOSAL</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <p className="text-slate-500 text-[10px] uppercase">SANCTIONED TITLE</p>
                <p className="font-medium text-white mt-0.5 leading-snug">{currentTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
                <div>
                  <p className="text-slate-500 text-[10px]">SANCTION DATE</p>
                  <p className="text-slate-300 mt-0.5">{currentSanctionDate}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px]">SANCTION AMOUNT</p>
                  <p className="text-amber-400 font-semibold mt-0.5">{formatINR(currentSanctionAmount)}</p>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-800/80">
                <p className="text-slate-500 text-[10px]">IMPLEMENTING AGENCY</p>
                <p className="text-slate-300 text-xs truncate mt-0.5">{currentAgency}</p>
              </div>

              <div>
                <p className="text-slate-500 text-[10px]">LOCATION</p>
                <p className="text-slate-300 text-xs flex items-center gap-1.5 mt-0.5">
                  <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
                  {currentLocationName}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Matched Duplicate Project */}
          <div className="rounded-md border border-slate-800 bg-[#0b1016] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="rounded px-2 py-0.5 bg-amber-950/40 border border-amber-900/60 text-[10px] font-medium text-amber-400">
                  MATCHED PRIOR WORK
                </span>
                <span className="font-mono text-xs text-amber-400 font-medium">
                  {matchedProjectId}
                </span>
              </div>
              <a
                href={`/investigation/${matchedProjectId}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
              >
                INSPECT <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <p className="text-slate-500 text-[10px] uppercase">SANCTIONED TITLE</p>
                <p className="font-medium text-white mt-0.5 leading-snug">{matchedProjectTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
                <div>
                  <p className="text-slate-500 text-[10px]">SANCTION DATE</p>
                  <p className="text-slate-300 mt-0.5">{matchedSanctionDate}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px]">SANCTION AMOUNT</p>
                  <p className="text-white font-semibold mt-0.5">{formatINR(matchedSanctionAmount)}</p>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-800/80">
                <p className="text-slate-500 text-[10px]">IMPLEMENTING AGENCY</p>
                <p className="text-slate-300 text-xs truncate mt-0.5 flex items-center gap-1.5">
                  {isSameImplementingAgency && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                  )}
                  {matchedImplementingAgency}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-[10px]">LOCATION</p>
                <p className="text-slate-300 text-xs flex items-center gap-1.5 mt-0.5">
                  <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
                  {matchedLocationName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle Bar */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('tokens')}
              className={`px-3 py-1.5 text-xs rounded-md transition ${
                viewMode === 'tokens'
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Split className="h-3.5 w-3.5" />
                <span>TOKEN HIGHLIGHT VIEW</span>
              </div>
            </button>
            <button
              onClick={() => setViewMode('phrases')}
              className={`px-3 py-1.5 text-xs rounded-md transition ${
                viewMode === 'phrases'
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>MATCHED PHRASES ({matchedPhrases.length})</span>
              </div>
            </button>
            <button
              onClick={() => setViewMode('details')}
              className={`px-3 py-1.5 text-xs rounded-md transition ${
                viewMode === 'details'
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>AUDIT DIRECTIVES</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
            <span>SEMANTIC: <strong className="text-amber-400">{semanticMatchScore}%</strong></span>
            <span className="text-slate-700">|</span>
            <span>SYNTACTIC: <strong className="text-slate-300">{syntacticMatchScore}%</strong></span>
          </div>
        </div>

        {/* Token Diff View */}
        {viewMode === 'tokens' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-[#0b1016] border border-slate-800">
            <div>
              <p className="text-xs text-slate-500 tracking-wider uppercase mb-2">
                CURRENT DPR DESCRIPTION TOKENIZATION:
              </p>
              <div className="text-xs leading-relaxed flex flex-wrap gap-1.5">
                {currentDescriptionTokens.map((t, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded font-mono text-xs ${
                      t.isMatched
                        ? 'bg-amber-950/50 text-amber-300 border border-amber-900/60'
                        : 'text-slate-400 bg-[#101720] border border-slate-800'
                    }`}
                  >
                    {t.text}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 tracking-wider uppercase mb-2">
                PRIOR MATCHED DPR DESCRIPTION TOKENIZATION:
              </p>
              <div className="text-xs leading-relaxed flex flex-wrap gap-1.5">
                {matchedDescriptionTokens.map((t, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded font-mono text-xs ${
                      t.isMatched
                        ? 'bg-amber-950/50 text-amber-300 border border-amber-900/60'
                        : 'text-slate-400 bg-[#101720] border border-slate-800'
                    }`}
                  >
                    {t.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Matched Phrases View */}
        {viewMode === 'phrases' && (
          <div className="space-y-3 p-4 rounded-lg bg-[#0b1016] border border-slate-800">
            <p className="text-xs text-slate-500 tracking-wider uppercase">
              IDENTICAL / NEAR-IDENTICAL SCOPE OF WORK PHRASES:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {matchedPhrases.map((phrase, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-md bg-[#101720] border border-slate-800 text-xs text-slate-200"
                >
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="text-amber-200 font-mono text-[11px]">&ldquo;{phrase}&rdquo;</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Observations View */}
        {viewMode === 'details' && (
          <div className="p-4 rounded-lg bg-[#0b1016] border border-slate-800 space-y-2.5">
            <p className="text-xs text-slate-500 tracking-wider uppercase">
              ALGORITHMIC FINDINGS & FIELD CHECKPOINTS:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              {riskObservations.map((obs, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <ChevronRight className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuplicateSimilarityPanel;
