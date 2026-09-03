'use client';

import React from 'react';
import {
  History,
  Clock,
  Tag,
} from 'lucide-react';
import { AuditHistoryEntry } from '../../types/investigation';

interface AuditHistoryDrawerProps {
  history: AuditHistoryEntry[];
}

export const AuditHistoryDrawer: React.FC<AuditHistoryDrawerProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="rounded-lg border border-slate-800 bg-[#101720] p-6 text-center text-xs text-slate-500 font-mono">
        NO PREVIOUS STATUTORY ACTIONS RECORDED FOR THIS CASE FILE.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-[#101720] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#0b1016]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md border border-slate-800 bg-[#101720] text-emerald-400">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white">
              AUDIT TRAIL & PREVIOUS ACTIONS
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable chain of recorded supervisory determinations and officer instructions
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">
          {history.length} {history.length === 1 ? 'RECORD' : 'RECORDS'}
        </span>
      </div>

      {/* Log entries */}
      <div className="p-6 space-y-4">
        {history.map((entry, idx) => (
          <div
            key={entry.id || idx}
            className="p-4 rounded-md bg-[#0b1016] border border-slate-800 space-y-2.5 text-xs font-mono"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/60 text-[10px] font-medium text-emerald-400 uppercase">
                  {entry.action.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-medium text-white font-sans">
                  {entry.officerName}
                </span>
                <span className="text-xs text-slate-500 font-sans">({entry.officerDesignation})</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{new Date(entry.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
              </div>
            </div>

            {/* Officer Notes */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-[#101720] p-3 rounded-md border border-slate-800/60">
              &ldquo;{entry.reviewNotes}&rdquo;
            </p>

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {entry.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#101720] text-slate-400 border border-slate-800 text-[10px]"
                  >
                    <Tag className="h-2.5 w-2.5 text-emerald-400" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditHistoryDrawer;
