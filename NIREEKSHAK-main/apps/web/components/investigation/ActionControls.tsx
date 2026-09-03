'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  FileCheck,
  Send,
  Loader2,
  AlertCircle,
  UserCheck,
  Tag,
  PenTool,
  Lock,
} from 'lucide-react';
import {
  InvestigationAction,
  VerifyInvestigationRequest,
  VerifyInvestigationResponse,
} from '../../types/investigation';
import { submitInvestigationAction } from '../../lib/sihMockData';

interface ActionControlsProps {
  projectId: string;
  currentStatus: {
    isReviewed: boolean;
    currentAction: InvestigationAction | null;
    reviewedBy?: string;
    reviewedAt?: string;
    reviewNotes?: string;
    tags?: string[];
  };
  onActionComplete?: (response: VerifyInvestigationResponse) => void;
}

const PRESET_TAGS = [
  'Physical Site Inspection Mandated',
  'DPR Rate Overrun Justification Needed',
  'Duplicate Asset Geotag Audit Required',
  'Technical Sanction Variance Clarification',
  'Utilization Certificate (UC) Demand Notice',
  'Valid Topography / Terrestrial Allowance',
  'Implementing Contractor Concentration Check',
];

export const ActionControls: React.FC<ActionControlsProps> = ({
  projectId,
  currentStatus,
  onActionComplete,
}) => {
  const [selectedAction, setSelectedAction] = useState<InvestigationAction>(
    currentStatus.currentAction || 'UNDER_INVESTIGATION'
  );
  const [notes, setNotes] = useState<string>(currentStatus.reviewNotes || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    currentStatus.tags || ['Physical Site Inspection Mandated', 'DPR Rate Overrun Justification Needed']
  );
  const [officerName, setOfficerName] = useState<string>('S. K. Verma, IAS');
  const [officerDesignation, setOfficerDesignation] = useState<string>(
    'District Vigilance Commissioner & Chief Audit Officer'
  );
  const [officerId, setOfficerId] = useState<string>('GOI-VGL-8821');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setErrorMessage('Official investigation notes are mandatory prior to registering statutory determination.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    setSubmitSuccessMsg(null);

    const payload: VerifyInvestigationRequest = {
      projectId,
      action: selectedAction,
      reviewNotes: notes.trim(),
      officerId,
      officerName,
      officerDesignation,
      tags: selectedTags,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await submitInvestigationAction(payload);
      if (response.success) {
        setSubmitSuccessMsg(response.message);
        if (onActionComplete) {
          onActionComplete(response);
        }
      } else {
        setErrorMessage(response.message || 'Failed to record official determination.');
      }
    } catch (_err) {
      setErrorMessage('Network error connecting to NIREEKSHAK central vigilance endpoint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-[#101720] overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-6 py-4 bg-[#0b1016]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md border border-slate-800 bg-[#101720] text-emerald-400">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold tracking-wider text-white">
                INVESTIGATOR ACTION CONSOLE
              </h3>
              <span className="rounded border border-emerald-900 bg-emerald-950/40 px-2 py-0.5 text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                AUDIT LOGGED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Official statutory determination console (POST /api/investigation/verify)
            </p>
          </div>
        </div>

        {/* Active Status Badge */}
        {currentStatus.isReviewed && currentStatus.currentAction && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#101720] border border-slate-800 text-xs font-mono">
            <span className="text-slate-500">STATUS:</span>
            <span className="text-emerald-400 font-semibold uppercase">
              {currentStatus.currentAction.replace(/_/g, ' ')}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Action Decision Selector */}
        <div className="space-y-3">
          <label className="text-xs tracking-wider text-slate-400 uppercase font-medium flex items-center justify-between">
            <span>SELECT STATUTORY DETERMINATION</span>
            <span className="text-slate-600 font-normal">STEP 1 OF 3</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {/* Option 1: Under Investigation */}
            <button
              type="button"
              onClick={() => setSelectedAction('UNDER_INVESTIGATION')}
              className={`p-5 rounded-md border text-left transition w-full ${
                selectedAction === 'UNDER_INVESTIGATION'
                  ? 'bg-[#0b1016] border-emerald-500 ring-1 ring-emerald-500/40 text-white'
                  : 'bg-[#0b1016] border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-semibold tracking-wide text-emerald-400 break-words">
                  UNDER INVESTIGATION
                </span>
                <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Initiate forensic scrutiny and depute field verification team.
              </p>
            </button>

            {/* Option 2: Mark for Review */}
            <button
              type="button"
              onClick={() => setSelectedAction('MARK_FOR_REVIEW')}
              className={`p-5 rounded-md border text-left transition w-full ${
                selectedAction === 'MARK_FOR_REVIEW'
                  ? 'bg-[#0b1016] border-amber-500 ring-1 ring-amber-500/40 text-amber-200'
                  : 'bg-[#0b1016] border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-semibold tracking-wide text-amber-400 break-words">
                  MARK FOR REVIEW
                </span>
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Flag for secondary audit by Sub-Divisional Technical Cell.
              </p>
            </button>

            {/* Option 3: Escalate to Vigilance */}
            <button
              type="button"
              onClick={() => setSelectedAction('ESCALATE_VIGILANCE')}
              className={`p-5 rounded-md border text-left transition w-full ${
                selectedAction === 'ESCALATE_VIGILANCE'
                  ? 'bg-[#0b1016] border-red-500 ring-1 ring-red-500/40 text-red-200'
                  : 'bg-[#0b1016] border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-semibold tracking-wide text-red-400 break-words">
                  ESCALATE TO VIGILANCE
                </span>
                <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Formally refer case to Chief Vigilance Officer for inquiry.
              </p>
            </button>

            {/* Option 4: Dismiss / Verified Clear */}
            <button
              type="button"
              onClick={() => setSelectedAction('DISMISS_CLEAR')}
              className={`p-5 rounded-md border text-left transition w-full ${
                selectedAction === 'DISMISS_CLEAR'
                  ? 'bg-[#0b1016] border-emerald-500 ring-1 ring-emerald-500/40 text-emerald-200'
                  : 'bg-[#0b1016] border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-semibold tracking-wide text-emerald-400 break-words">
                  DISMISS / CLEAR
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Anomaly verified as justified by valid DPR variance or terrain factors.
              </p>
            </button>
          </div>
        </div>

        {/* Action Directives / Tag Selectors */}
        <div className="space-y-2">
          <label className="text-xs tracking-wider text-slate-400 uppercase font-medium flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-emerald-400" />
            <span>INVESTIGATION ACTION DIRECTIVES & TAGS</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_TAGS.map((tag, idx) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-xs rounded-md transition border ${
                    isSelected
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900 font-medium'
                      : 'bg-[#0b1016] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Official Notes Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs tracking-wider text-slate-400 uppercase font-medium flex items-center gap-1.5">
              <PenTool className="h-3.5 w-3.5 text-emerald-400" />
              <span>OFFICIAL FINDINGS & INSTRUCTIONS</span>
              <span className="text-amber-400">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-600">
              {notes.length} CHARACTERS
            </span>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Record official observations, specific discrepancy directives, physical survey deadlines, and required clarifications..."
            className="w-full rounded-md bg-[#0b1016] border border-slate-800 px-4 py-3 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none leading-relaxed"
            required
          />
        </div>

        {/* Officer Credential Confirmation Bar */}
        <div className="p-4 rounded-md bg-[#0b1016] border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-[10px] uppercase text-slate-500 block">OFFICER IN-CHARGE:</span>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="bg-transparent text-white font-medium border-b border-slate-800 focus:border-emerald-500 outline-none w-full text-xs py-1"
            />
          </div>

          <div>
            <span className="text-[10px] uppercase text-slate-500 block">DESIGNATION:</span>
            <input
              type="text"
              value={officerDesignation}
              onChange={(e) => setOfficerDesignation(e.target.value)}
              className="bg-transparent text-white font-medium border-b border-slate-800 focus:border-emerald-500 outline-none w-full text-xs py-1"
            />
          </div>

          <div>
            <span className="text-[10px] uppercase text-slate-500 block">DIGITAL OFFICER ID:</span>
            <input
              type="text"
              value={officerId}
              onChange={(e) => setOfficerId(e.target.value)}
              className="bg-transparent text-slate-300 font-mono border-b border-slate-800 focus:border-emerald-500 outline-none w-full text-xs py-1"
            />
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="p-3 rounded-md bg-red-950/20 border border-red-900 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitSuccessMsg && (
          <div className="p-3 rounded-md bg-emerald-950/20 border border-emerald-900 text-xs text-emerald-400 flex items-center gap-2">
            <FileCheck className="h-4 w-4 shrink-0" />
            <span>{submitSuccessMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500 font-mono">
            DIGITALLY SIGNED • NIREEKSHAK CENTRAL AUDIT TRAIL
          </span>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-md border border-emerald-700 bg-emerald-950/40 px-5 py-2.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-900/40 disabled:bg-slate-800 disabled:text-slate-500"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                <span>RECORDING ACTION...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 text-emerald-400" />
                <span>SUBMIT DETERMINATION</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActionControls;
