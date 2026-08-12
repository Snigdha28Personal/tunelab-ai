"use client";

import React from "react";
import { ProductDecisionResponse, MetricResults, EvaluationConfig } from "@/types/experiment";
import { CheckCircle, XCircle, AlertCircle, ShieldCheck, Sparkles } from "lucide-react";

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
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 font-medium">
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
        className={`rounded-2xl border p-6 shadow-md transition-all ${
          isRecommended
            ? "border-emerald-300 bg-gradient-to-r from-emerald-50 via-white to-white"
            : isConsider
            ? "border-amber-300 bg-gradient-to-r from-amber-50 via-white to-white"
            : "border-rose-300 bg-gradient-to-r from-rose-50 via-white to-white"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-black tracking-wider uppercase border ${
                  isRecommended
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : isConsider
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : "bg-rose-100 text-rose-800 border-rose-300"
                }`}
              >
                DECISION: {decision.decision}
              </span>
              <span className="text-xs text-slate-600 font-medium">
                Macro F1: {(baselineMetrics.macro_f1 * 100).toFixed(1)}% → {(finetunedMetrics.macro_f1 * 100).toFixed(1)}%
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">{decision.headline}</h2>
            <p className="text-xs text-slate-700 font-medium max-w-2xl">{decision.next_step}</p>
          </div>

          <div className="rounded-xl bg-white p-4 border border-slate-200 text-center min-w-[180px] shadow-xs">
            <div className="text-[10px] uppercase font-bold text-slate-500">Quality Improvement</div>
            <div className="text-3xl font-black text-emerald-700">
              +{decision.macro_f1_delta * 100 > 0 ? (decision.macro_f1_delta * 100).toFixed(1) : "0.0"} pts
            </div>
            <div className="text-[11px] text-indigo-700 font-bold">
              +{(decision.macro_f1_relative_delta || 0).toFixed(1)}% Relative Gain
            </div>
          </div>
        </div>
      </div>

      {/* Product Guardrails Validation Checklist */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">PM Guardrails & SLA Criteria Validation</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Evaluated Programmatically</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          {/* Criterion 1 */}
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold">Target F1 Threshold</span>
              {decision.passes_target_f1 ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-600" />
              )}
            </div>
            <div className="font-bold text-slate-900">
              {(finetunedMetrics.macro_f1 * 100).toFixed(1)}% vs {(config.target_macro_f1 * 100).toFixed(0)}%
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {decision.passes_target_f1 ? "Passes target threshold" : "Failed target threshold"}
            </div>
          </div>

          {/* Criterion 2 */}
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold">Min Improvement</span>
              {decision.passes_min_improvement ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-600" />
              )}
            </div>
            <div className="font-bold text-slate-900">
              +{(decision.macro_f1_delta * 100).toFixed(1)} pts vs +{(config.min_f1_improvement * 100).toFixed(1)} pts
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {decision.passes_min_improvement ? "Exceeds minimum delta" : "Below minimum delta"}
            </div>
          </div>

          {/* Criterion 3 */}
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold">Cost Guardrail</span>
              {decision.passes_cost_guardrail ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-600" />
              )}
            </div>
            <div className="font-bold text-slate-900">
              ${finetunedMetrics.cost_per_1k.toFixed(2)} vs cap ${config.max_cost_per_1k.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {decision.passes_cost_guardrail ? "Within budget guardrail" : "Breached budget cap"}
            </div>
          </div>

          {/* Criterion 4 */}
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold">Latency SLA</span>
              {decision.passes_latency_guardrail ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-600" />
              )}
            </div>
            <div className="font-bold text-slate-900">
              {finetunedMetrics.avg_latency.toFixed(2)}s vs limit {config.max_latency_seconds.toFixed(1)}s
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {decision.passes_latency_guardrail ? "Satisfies SLA limit" : "Exceeded SLA limit"}
            </div>
          </div>
        </div>
      </div>

      {/* Decision Reasons & Risks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            <CheckCircle className="h-4 w-4" />
            Decision Justification & Supporting Rationale
          </h3>
          <div className="space-y-2 text-xs">
            {decision.reasons.map((r, i) => (
              <div key={i} className="flex items-start space-x-2 text-slate-800 font-medium">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            <AlertCircle className="h-4 w-4" />
            Identified Risks & Residual Confusions
          </h3>
          <div className="space-y-2 text-xs">
            {decision.risks.map((risk, i) => (
              <div key={i} className="flex items-start space-x-2 text-slate-800 font-medium">
                <span className="text-rose-600 font-bold">•</span>
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Educational AI PM Principle Box */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 p-4 text-xs text-indigo-950 flex items-start space-x-3 shadow-xs">
        <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-indigo-950 block font-extrabold">TuneLab Core Product Principle:</strong>
          <span className="font-medium">
            "Do NOT fine-tune simply because you can. Fine-tune when measured product quality, business impact, and risk reduction justify its additional cost and maintenance complexity."
          </span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500"
        >
          <span>Proceed to STEP 07 — Multi-Phase Rollout Strategy</span>
        </button>
      </div>
    </div>
  );
}
