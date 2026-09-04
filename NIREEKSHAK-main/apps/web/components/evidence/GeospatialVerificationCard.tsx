'use client';

import React from 'react';
import {
  Crosshair,
  Satellite,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import { GeospatialEvidence } from '../../types/investigation';

interface GeospatialVerificationCardProps {
  evidence: GeospatialEvidence;
  projectLocationTitle: string;
  matchedCoords?: { lat: number; lng: number };
  matchedDistanceMeters?: number;
}

export const GeospatialVerificationCard: React.FC<GeospatialVerificationCardProps> = ({
  evidence,
  projectLocationTitle,
  matchedCoords,
  matchedDistanceMeters,
}) => {
  const {
    latitude = 0,
    longitude = 0,
    geoAccuracyMeters,
    geoSource,
    nearestPeerWorksCountWithin500m,
    clusterAnomalyDetected,
    satelliteClearanceScore,
    cadastralLandId,
    landStatusNote,
  } = evidence;

  return (
    <div className="rounded-lg border border-slate-800 bg-[#101720] overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-6 py-4 bg-[#0b1016]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md border border-slate-800 bg-[#101720] text-emerald-400">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold tracking-wider text-white">
                GEOSPATIAL AUDIT & BOUNDARY VERIFICATION
              </h3>
              {clusterAnomalyDetected && (
                <span className="rounded border border-amber-900 bg-amber-950/40 px-2.5 py-0.5 text-xs text-amber-400 font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  CLUSTER ANOMALY
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              High-precision GPS coordinate verification, land record cross-referencing, and satellite baseline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-md bg-[#101720] text-slate-300 text-xs font-mono border border-slate-800">
            ACCURACY: <strong className="text-emerald-400">±{geoAccuracyMeters}m</strong>
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Map / Radar Container */}
        <div className="relative h-60 w-full bg-[#0b1016] rounded-lg border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #334155 1px, transparent 1px),
                linear-gradient(to bottom, #334155 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px, 24px 24px',
            }}
          />

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-[#101720] px-3 py-1.5 rounded-md border border-slate-800 text-xs font-mono text-slate-300">
              <Crosshair className="h-3.5 w-3.5 text-emerald-400" />
              <span>{latitude.toFixed(6)}° N, {longitude.toFixed(6)}° E</span>
            </div>

            <div className="flex items-center gap-2 bg-[#101720] px-3 py-1.5 rounded-md border border-slate-800 text-xs font-mono text-emerald-400">
              <Satellite className="h-3.5 w-3.5" />
              <span>ISRO / BHUVAN SYNC</span>
            </div>
          </div>

          {/* Center Radar / Pin */}
          <div className="relative z-10 flex items-center justify-center my-auto">
            <div className="relative flex items-center justify-center">
              <div className="h-28 w-28 rounded-full border border-emerald-500/20 absolute animate-pulse" />
              <div className="h-16 w-16 rounded-full border border-emerald-500/40 bg-emerald-950/20 absolute" />

              {/* Center Marker */}
              <div className="relative z-20 flex flex-col items-center">
                <div className="h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-[#0b1016]" />
                <span className="mt-1 px-2 py-0.5 rounded bg-[#101720] text-emerald-400 text-[9px] font-mono font-semibold border border-emerald-900">
                  SUBJECT SITE
                </span>
              </div>

              {/* Matched Marker */}
              {matchedCoords && (
                <div className="absolute -top-8 right-12 flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="mt-0.5 px-1.5 py-0.5 rounded bg-[#101720] text-amber-400 text-[8px] font-mono border border-amber-900">
                    PRIOR WORK ({matchedDistanceMeters}m)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 bg-[#101720] p-2.5 rounded-md border border-slate-800">
            <span className="truncate max-w-[280px] text-slate-300">
              {projectLocationTitle}
            </span>
            <span className="text-amber-400 text-[11px] shrink-0 font-mono">
              {nearestPeerWorksCountWithin500m} ASSETS WITHIN 500m
            </span>
          </div>
        </div>

        {/* Spatial Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-[#0b1016] rounded-md border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block font-medium">CADASTRAL PLOT REF</span>
            <span className="text-white font-semibold text-sm">{cadastralLandId}</span>
            <div className="text-slate-400 text-xs">{landStatusNote}</div>
          </div>

          <div className="p-3.5 bg-[#0b1016] rounded-md border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block font-medium">GPS CAPTURE MODE</span>
            <span className="text-emerald-400 font-semibold text-sm">{geoSource.replace(/_/g, ' ')}</span>
            <div className="text-slate-400 text-xs">e-SAKSHI Geotag Sentinel</div>
          </div>

          <div className="p-3.5 bg-[#0b1016] rounded-md border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block font-medium">SATELLITE CLEARANCE</span>
            <span className="text-amber-400 font-semibold text-sm">{satelliteClearanceScore} / 100</span>
            <div className="text-slate-400 text-xs">Ground disturbance verified</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeospatialVerificationCard;
