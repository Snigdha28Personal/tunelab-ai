"use client";

import React from "react";
import { ProductDecisionResponse, MetricResults, EvaluationConfig } from "@/types/experiment";
import { Award, CheckCircle, XCircle, AlertCircle, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";

interface DecisionStepProps {
  decision: ProductDecisionResponse | null;
  baselineMetrics: MetricResults | null;
  finetunedMetrics: MetricResults | null;
  config: EvaluationConfig;
  onNext: () => void;
}

export function DecisionStep({
  decision,
  baselineMetrics,
  finetunedMetrics,
  config,
  onNext
}: DecisionStepProps) {
  if (!decision || !baselineMetrics || !finetunedMetrics) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
        Run experiment pipeline to view product decision recommendations.
      </div>
    );
  }

  const isRecommended = decision.decision === "RECOMMENDED";
  const isConsider = decision.decision === "CONSIDER";

  return (
    <div className="space-y-6">
      {/* Top Banner Decision Card */}
      <div
        className={`rounded-2xl border p-6 shadow-2xl transition-all ${
          isRecommended
            ? "border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 shadow-emerald-500/10"
            : isConsider
            ? "border-amber-500/40 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 shadow-amber-500/10"
            : "border-rose-500/40 bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 shadow-rose-500/10"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-black tracking-wider uppercase border ${
                  isRecommended
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : isConsider
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                }`}
              >
                DECISION: {decision.decision}
              </span>
              <span className="text-xs text-slate-400">Macro F1: {(baselineMetrics.macro_f1 * 100).toFixed(1)}% → {(finetunedMetrics.macro_f1 * 100).toFixed(1)}%</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">{decision.headline}</h2>
            <p className="text-xs text-slate-300 max-w-2xl">{decision.next_step}</p>
          </div>

          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 text-center min-w-[180px]">
            <div className="text-[10px] uppercase font-bold text-slate-500">Quality Improvement</div>
            <div className="text-3xl font-black text-emerald-400">
              +{decision.macro_f1_delta * 100 > 0 ? (decision.macro_f1_delta * 100).toFixed(1) : "0.0"} pts
            </div>
            <div className="text-[11px] text-indigo-300 font-semibold">
              +{(decision.macro_f1_relative_delta || 0).toFixed(1)}% Relative Gain
            </div>
          </div>
        </div>
      </div>

      {/* Product Guardrails Validation Checklist */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">PM Guardrails & SLA Criteria Validation</h3>
          </div>
          <span className="text-xs text-slate-500">Evaluated Programmatically</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          {/* Criterion 1 */}
          <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target F1 Threshold</span>
              {decision.passes_target_f1 ? (
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-400" />
              )}
            </div>
            <div className="font-bold text-white">
              {(finetunedMetrics.macro_f1 * 100).toFixed(1)}% vs {(config.target_macro_f1 * 100).toFixed(0)}%
            </div>
            <div className="text-[10px] text-slate-500">
              {decision.passes_target_f1 ? "Passes target threshold" : "Failed target threshold"}
            </div>
          </div>

          {/* Criterion 2 */}
          <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Min Improvement</span>
              {decision.passes_min_improvement ? (
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-400" />
              )}
            </div>
            <div className="font-bold text-white">
              +{(decision.macro_f1_delta * 100).toFixed(1)} pts vs +{(config.min_f1_improvement * 100).toFixed(1)} pts
            </div>
            <div className="text-[10px] text-slate-500">
              {decision.passes_min_improvement ? "Exceeds minimum delta" : "Below minimum delta"}
            </div>
          </div>

          {/* Criterion 3 */}
          <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Cost Guardrail</span>
              {decision.passes_cost_guardrail ? (
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-400" />
              )}
            </div>
            <div className="font-bold text-white">
              ${finetunedMetrics.cost_per_1k.toFixed(2)} vs cap ${config.max_cost_per_1k.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-500">
              {decision.passes_cost_guardrail ? "Within budget guardrail" : "Breached budget cap"}
            </div>
          </div>

          {/* Criterion 4 */}
          <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Latency SLA</span>
              {decision.passes_latency_guardrail ? (
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-400" />
              )}
            </div>
            <div className="font-bold text-white">
              {finetunedMetrics.avg_latency.toFixed(2)}s vs limit {config.max_latency_seconds.toFixed(1)}s
            </div>
            <div className="text-[10px] text-slate-500">
              {decision.passes_latency_guardrail ? "Satisfies SLA limit" : "Exceeded SLA limit"}
            </div>
          </div>
        </div>
      </div>

      {/* Decision Reasons & Risks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <CheckCircle className="h-4 w-4" />
            Decision Justification & Supporting Rationale
          </h3>
          <div className="space-y-2 text-xs">
            {decision.reasons.map((r, i) => (
              <div key={i} className="flex items-start space-x-2 text-slate-200">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <AlertCircle className="h-4 w-4" />
            Identified Risks & Residual Confusions
          </h3>
          <div className="space-y-2 text-xs">
            {decision.risks.map((risk, i) => (
              <div key={i} className="flex items-start space-x-2 text-slate-200">
                <span className="text-rose-400 font-bold">•</span>
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Educational AI PM Principle Box */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 text-xs text-indigo-300 flex items-start space-x-3">
        <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block font-bold">TuneLab Core Product Principle:</strong>
          <span>
            "Do NOT fine-tune simply because you can. Fine-tune when measured product quality, business impact, and risk reduction justify its additional cost and maintenance complexity."
          </span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500"
        >
          <span>Proceed to STEP 07 — Multi-Phase Rollout Strategy</span>
        </button>
      </div>
    </div>
  );
}
