"use client";

import React from "react";
import { RolloutPlan } from "@/types/experiment";
import { Layers, ShieldAlert, Activity, Users, Calendar, CheckCircle2, AlertOctagon } from "lucide-react";

interface RolloutStepProps {
  rolloutPlan: RolloutPlan | null;
  onRestart: () => void;
}

export function RolloutStep({ rolloutPlan, onRestart }: RolloutStepProps) {
  if (!rolloutPlan) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
        Run experiment pipeline to view production rollout plan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="h-5 w-5 text-indigo-400" />
          Production Rollout Strategy & Risk Mitigation Plan
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Gradual traffic ramp schedule (5% → 25% → 50% → 100%) with explicit automated rollback triggers.
        </p>
      </div>

      {/* 4 Phase Rollout Timeline Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {rolloutPlan.phases.map((phase) => (
          <div
            key={phase.phase}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Phase {phase.phase}
                </span>
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-extrabold text-indigo-300 border border-indigo-500/20">
                  {phase.traffic_percentage}% Traffic
                </span>
              </div>

              <div className="my-3 space-y-1.5 text-xs">
                <div className="font-bold text-white text-sm">{phase.duration_days} Days Duration</div>
                <p className="text-slate-300 leading-relaxed">{phase.key_objective}</p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800 text-[11px] space-y-1">
              <span className="text-slate-500 font-semibold block">Success Gate Criteria:</span>
              <span className="text-emerald-400">{phase.success_gate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rollback Triggers & Monitoring Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Rollback Triggers */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-3">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="h-4 w-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">Automated Rollback Triggers</h3>
            </div>
            <span className="text-[11px] text-rose-400 font-semibold">Immediate Fallback</span>
          </div>

          <div className="space-y-2 text-xs">
            {rolloutPlan.rollback_triggers.map((trigger, i) => (
              <div key={i} className="flex items-start space-x-2 rounded-lg bg-rose-500/10 p-2.5 border border-rose-500/20 text-rose-300">
                <span className="font-bold text-rose-400 shrink-0">Trigger #{i + 1}:</span>
                <span>{trigger}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monitoring Metrics & Governance */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-3 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Real-Time Telemetry & Monitoring</h3>
              </div>
            </div>

            <div className="space-y-2 my-3 text-xs">
              {rolloutPlan.monitoring_metrics.map((metric, i) => (
                <div key={i} className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>{metric}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded bg-slate-950 p-2 text-slate-400">
              <span className="text-slate-500 block">Owner</span>
              <strong className="text-slate-200">{rolloutPlan.owner}</strong>
            </div>
            <div className="rounded bg-slate-950 p-2 text-slate-400">
              <span className="text-slate-500 block">Review Cadence</span>
              <strong className="text-slate-200">{rolloutPlan.review_cadence}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400">
          Experiment run complete. Download report or start a new experiment.
        </div>
        <button
          onClick={onRestart}
          className="flex items-center space-x-2 rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white hover:bg-slate-700 transition-all"
        >
          <span>Start New Experiment</span>
        </button>
      </div>
    </div>
  );
}
