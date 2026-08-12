"use client";

import React from "react";
import { RolloutPlan } from "@/types/experiment";
import { Layers, Activity, CheckCircle2, AlertOctagon } from "lucide-react";

interface RolloutStepProps {
  rolloutPlan: RolloutPlan | null;
  onRestart: () => void;
}

export function RolloutStep({ rolloutPlan, onRestart }: RolloutStepProps) {
  if (!rolloutPlan) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 font-medium">
        Run experiment pipeline to view production rollout plan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Layers className="h-5 w-5 text-indigo-600" />
          Production Rollout Strategy & Risk Mitigation Plan
        </h2>
        <p className="mt-1 text-sm text-slate-500 font-medium">
          Gradual traffic ramp schedule (5% → 25% → 50% → 100%) with explicit automated rollback triggers.
        </p>
      </div>

      {/* 4 Phase Rollout Timeline Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {rolloutPlan.phases.map((phase) => (
          <div
            key={phase.phase}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                  Phase {phase.phase}
                </span>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-extrabold text-indigo-800 border border-indigo-200">
                  {phase.traffic_percentage}% Traffic
                </span>
              </div>

              <div className="my-3 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 text-sm">{phase.duration_days} Days Duration</div>
                <p className="text-slate-700 leading-relaxed font-medium">{phase.key_objective}</p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 text-[11px] space-y-1">
              <span className="text-slate-500 font-bold block">Success Gate Criteria:</span>
              <span className="text-emerald-700 font-bold">{phase.success_gate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rollback Triggers & Monitoring Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Rollback Triggers */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="h-4 w-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">Automated Rollback Triggers</h3>
            </div>
            <span className="text-[11px] text-rose-700 font-bold">Immediate Fallback</span>
          </div>

          <div className="space-y-2 text-xs">
            {rolloutPlan.rollback_triggers.map((trigger, i) => (
              <div key={i} className="flex items-start space-x-2 rounded-lg bg-rose-50 p-2.5 border border-rose-200 text-rose-900 font-medium">
                <span className="font-bold text-rose-700 shrink-0">Trigger #{i + 1}:</span>
                <span>{trigger}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monitoring Metrics & Governance */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Real-Time Telemetry & Monitoring</h3>
              </div>
            </div>

            <div className="space-y-2 my-3 text-xs">
              {rolloutPlan.monitoring_metrics.map((metric, i) => (
                <div key={i} className="flex items-center space-x-2 text-slate-800 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>{metric}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded bg-slate-50 p-2 border border-slate-100 text-slate-600">
              <span className="text-slate-500 font-semibold block">Owner</span>
              <strong className="text-slate-900 font-bold">{rolloutPlan.owner}</strong>
            </div>
            <div className="rounded bg-slate-50 p-2 border border-slate-100 text-slate-600">
              <span className="text-slate-500 font-semibold block">Review Cadence</span>
              <strong className="text-slate-900 font-bold">{rolloutPlan.review_cadence}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500 font-medium">
          Experiment run complete. Download report or start a new experiment.
        </div>
        <button
          onClick={onRestart}
          className="flex items-center space-x-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800 transition-all shadow-sm"
        >
          <span>Start New Experiment</span>
        </button>
      </div>
    </div>
  );
}
