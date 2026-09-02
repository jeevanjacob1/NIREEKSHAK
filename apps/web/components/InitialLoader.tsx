"use client";

import { useEffect, useState } from "react";

const loadingSteps = [
  "INITIALIZING INTELLIGENCE ENGINE...",
  "LOADING PROJECT REGISTRY...",
  "PREPARING ANOMALY ANALYSIS...",
  "VERIFYING RISK SIGNALS...",
];

export default function InitialLoader({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        const next = current + 2;

        if (next >= 100) {
          window.clearInterval(progressTimer);

          window.setTimeout(() => {
            setClosing(true);

            window.setTimeout(() => {
              onComplete();
            }, 500);
          }, 300);

          return 100;
        }

        return next;
      });
    }, 35);

    return () => window.clearInterval(progressTimer);
  }, [onComplete]);

  useEffect(() => {
    const stepTimer = window.setInterval(() => {
      setStep((current) =>
        current < loadingSteps.length - 1 ? current + 1 : current
      );
    }, 650);

    return () => window.clearInterval(stepTimer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#080d12] transition-opacity duration-500 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(51,65,85,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(51,65,85,0.18) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative w-full max-w-xl px-6">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center gap-4">
            <span className="h-3.5 w-3.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.8)]" />

            <h1 className="text-3xl font-bold tracking-[0.28em] text-white sm:text-4xl">
              NIREEKSHAK
            </h1>
          </div>

          <p className="mt-4 text-[10px] tracking-[0.4em] text-slate-500 sm:text-xs">
            MPLADS INTELLIGENCE SYSTEM
          </p>
        </div>

        {/* Loading panel */}
        <div className="mt-14 rounded-xl border border-slate-800 bg-[#0d141c]/90 p-6 shadow-2xl backdrop-blur">
          {/* Terminal heading */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-slate-600">
              SYSTEM INITIALIZATION
            </span>

            <span className="font-mono text-[10px] text-emerald-400">
              {progress}%
            </span>
          </div>

          {/* Current operation */}
          <div className="mt-6 flex min-h-[24px] items-center gap-3">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

            <span className="font-mono text-xs tracking-wide text-emerald-400">
              {loadingSteps[step]}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Status lines */}
          <div className="mt-7 space-y-3">
            {loadingSteps.map((item, index) => {
              const completed = progress >= (index + 1) * 25;

              return (
                <div
                  key={item}
                  className={`flex items-center gap-3 font-mono text-[10px] transition-all duration-500 ${
                    completed
                      ? "text-slate-400"
                      : index === step
                        ? "text-emerald-400"
                        : "text-slate-700"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border text-[9px] ${
                      completed
                        ? "border-emerald-800 bg-emerald-950/40 text-emerald-400"
                        : "border-slate-800 text-slate-700"
                    }`}
                  >
                    {completed ? "✓" : "•"}
                  </span>

                  <span>{item}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="font-mono text-[9px] tracking-[0.25em] text-slate-700">
            SIH26102 · TRUSTUS
          </p>

          <p className="mt-2 text-[9px] text-slate-700">
            Evidence-driven public sector intelligence
          </p>
        </div>
      </div>
    </div>
  );
}