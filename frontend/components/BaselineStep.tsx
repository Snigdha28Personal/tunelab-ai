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
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-400" />
          Experiment Design & Baseline Setup
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Define your experiment hypothesis, primary product metrics, and SLA guardrails before baseline benchmarking.
        </p>
      </div>

      {/* Hypothesis Input Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Product Experiment Hypothesis</h3>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Hypothesis Statement
          </label>
          <textarea
            rows={2}
            value={config.hypothesis}
            onChange={(e) => setConfig({ ...config, hypothesis: e.target.value })}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            placeholder="e.g. Fine-tuning will improve ticket classification Macro F1 by at least 5 percentage points..."
          />
        </div>
      </div>

      {/* Success Metrics & Guardrail Thresholds */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Target Macro F1 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Primary Target (Macro F1)</span>
            <Target className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white">{(config.target_macro_f1 * 100).toFixed(0)}%</span>
            <span className="text-xs text-slate-500">Macro F1</span>
          </div>
          <input
            type="range"
            min="0.50"
            max="0.99"
            step="0.01"
            value={config.target_macro_f1}
            onChange={(e) => setConfig({ ...config, target_macro_f1: parseFloat(e.target.value) })}
            className="w-full accent-indigo-500"
          />
          <p className="text-[10px] text-slate-500">Minimum acceptable Macro F1 score.</p>
        </div>

        {/* Metric 2: Min Improvement Delta */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Min Quality Delta</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white">+{(config.min_f1_improvement * 100).toFixed(1)}</span>
            <span className="text-xs text-slate-500">pts</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.20"
            step="0.005"
            value={config.min_f1_improvement}
            onChange={(e) => setConfig({ ...config, min_f1_improvement: parseFloat(e.target.value) })}
            className="w-full accent-purple-500"
          />
          <p className="text-[10px] text-slate-500">Required F1 improvement vs baseline.</p>
        </div>

        {/* Metric 3: Max Cost Guardrail */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Cost Cap / 1K Preds</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white">${config.max_cost_per_1k.toFixed(2)}</span>
            <span className="text-xs text-slate-500">/ 1K</span>
          </div>
          <input
            type="range"
            min="0.20"
            max="5.00"
            step="0.10"
            value={config.max_cost_per_1k}
            onChange={(e) => setConfig({ ...config, max_cost_per_1k: parseFloat(e.target.value) })}
            className="w-full accent-emerald-500"
          />
          <p className="text-[10px] text-slate-500">Budget cap for inference costs.</p>
        </div>

        {/* Metric 4: Max Latency SLA */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Latency SLA Limit</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white">{config.max_latency_seconds.toFixed(1)}s</span>
            <span className="text-xs text-slate-500">avg</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.1"
            value={config.max_latency_seconds}
            onChange={(e) => setConfig({ ...config, max_latency_seconds: parseFloat(e.target.value) })}
            className="w-full accent-amber-500"
          />
          <p className="text-[10px] text-slate-500">Maximum allowed response time.</p>
        </div>
      </div>

      {/* Baseline Prompt Setup */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <MessageSquare className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Baseline Prompting Model Configuration</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Base Model Provider</label>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200">
              OpenAI gpt-4o-mini (Baseline Prompting)
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Temperature setting</label>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 font-mono">
              0.0 (Deterministic classification)
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500"
        >
          <span>Proceed to STEP 03 — Prepare Fine-Tuning JSONL</span>
        </button>
      </div>
    </div>
  );
}
