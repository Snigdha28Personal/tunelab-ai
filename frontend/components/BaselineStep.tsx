"use client";

import React from "react";
import { EvaluationConfig } from "@/types/experiment";
import { Target, Shield, Clock, DollarSign, Sparkles, MessageSquare } from "lucide-react";

interface BaselineStepProps {
  config: EvaluationConfig;
  setConfig: React.Dispatch<React.SetStateAction<EvaluationConfig>>;
  onNext: () => void;
}

export function BaselineStep({ config, setConfig, onNext }: BaselineStepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-600" />
          Experiment Design & Baseline Setup
        </h2>
        <p className="mt-1 text-sm text-slate-500 font-medium">
          Define your experiment hypothesis, primary product metrics, and SLA guardrails before baseline benchmarking.
        </p>
      </div>

      {/* Hypothesis Input Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <h3 className="text-sm font-bold text-slate-900">Product Experiment Hypothesis</h3>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Hypothesis Statement
          </label>
          <textarea
            rows={2}
            value={config.hypothesis}
            onChange={(e) => setConfig({ ...config, hypothesis: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none font-medium"
            placeholder="e.g. Fine-tuning will improve ticket classification Macro F1 by at least 5 percentage points..."
          />
        </div>
      </div>

      {/* Success Metrics & Guardrail Thresholds */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Target Macro F1 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Primary Target (Macro F1)</span>
            <Target className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{(config.target_macro_f1 * 100).toFixed(0)}%</span>
            <span className="text-xs text-slate-500 font-semibold">Macro F1</span>
          </div>
          <input
            type="range"
            min="0.50"
            max="0.99"
            step="0.01"
            value={config.target_macro_f1}
            onChange={(e) => setConfig({ ...config, target_macro_f1: parseFloat(e.target.value) })}
            className="w-full accent-indigo-600"
          />
          <p className="text-[10px] text-slate-500 font-medium">Minimum acceptable Macro F1 score.</p>
        </div>

        {/* Metric 2: Min Improvement Delta */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Min Quality Delta</span>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">+{(config.min_f1_improvement * 100).toFixed(1)}</span>
            <span className="text-xs text-slate-500 font-semibold">pts</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.20"
            step="0.005"
            value={config.min_f1_improvement}
            onChange={(e) => setConfig({ ...config, min_f1_improvement: parseFloat(e.target.value) })}
            className="w-full accent-purple-600"
          />
          <p className="text-[10px] text-slate-500 font-medium">Required F1 improvement vs baseline.</p>
        </div>

        {/* Metric 3: Max Cost Guardrail */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Cost Cap / 1K Preds</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">${config.max_cost_per_1k.toFixed(2)}</span>
            <span className="text-xs text-slate-500 font-semibold">/ 1K</span>
          </div>
          <input
            type="range"
            min="0.20"
            max="5.00"
            step="0.10"
            value={config.max_cost_per_1k}
            onChange={(e) => setConfig({ ...config, max_cost_per_1k: parseFloat(e.target.value) })}
            className="w-full accent-emerald-600"
          />
          <p className="text-[10px] text-slate-500 font-medium">Budget cap for inference costs.</p>
        </div>

        {/* Metric 4: Max Latency SLA */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Latency SLA Limit</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{config.max_latency_seconds.toFixed(1)}s</span>
            <span className="text-xs text-slate-500 font-semibold">avg</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.1"
            value={config.max_latency_seconds}
            onChange={(e) => setConfig({ ...config, max_latency_seconds: parseFloat(e.target.value) })}
            className="w-full accent-amber-600"
          />
          <p className="text-[10px] text-slate-500 font-medium">Maximum allowed response time.</p>
        </div>
      </div>

      {/* Baseline Prompt Setup */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <MessageSquare className="h-4 w-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Baseline Prompting Model Configuration</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Base Model Provider</label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-medium">
              OpenAI gpt-4o-mini (Baseline Prompting)
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Temperature setting</label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-mono font-semibold">
              0.0 (Deterministic classification)
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500"
        >
          <span>Proceed to STEP 03 — Prepare Fine-Tuning JSONL</span>
        </button>
      </div>
    </div>
  );
}
