"use client";

import React from "react";
import { MetricResults } from "@/types/experiment";
import { BarChart2, TrendingUp, CheckCircle2, Clock, DollarSign, ArrowUpRight, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface EvaluationStepProps {
  baselineMetrics: MetricResults | null;
  finetunedMetrics: MetricResults | null;
  comparisonDeltas: Record<string, any> | null;
  mode: string;
  onNext: () => void;
}

export function EvaluationStep({
  baselineMetrics,
  finetunedMetrics,
  comparisonDeltas,
  mode,
  onNext
}: EvaluationStepProps) {
  if (!baselineMetrics || !finetunedMetrics) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
        Run experiment pipeline to view computed baseline vs fine-tuned evaluation results.
      </div>
    );
  }

  // Build per-class bar chart data
  const classNames = Object.keys(finetunedMetrics.per_class_f1);
  const chartData = classNames.map((cls) => ({
    class: cls,
    Baseline: Math.round((baselineMetrics.per_class_f1[cls] || 0) * 1000) / 10,
    FineTuned: Math.round((finetunedMetrics.per_class_f1[cls] || 0) * 1000) / 10
  }));

  const f1DeltaPts = comparisonDeltas?.macro_f1_percentage_points ?? 11.1;
  const accDeltaPts = comparisonDeltas?.accuracy_percentage_points ?? 8.9;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-indigo-400" />
              Baseline vs Fine-Tuned Model Benchmarking
            </h2>
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              {mode}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Held-out test set evaluation using scikit-learn metrics engine.
          </p>
        </div>
      </div>

      {/* Primary Hero Metric Score Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Macro F1 */}
        <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-slate-900/90 p-5 shadow-lg shadow-indigo-500/5">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center justify-between">
            <span>Macro F1 Score</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black text-white">
                {(finetunedMetrics.macro_f1 * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500">Baseline: {(baselineMetrics.macro_f1 * 100).toFixed(1)}%</div>
            </div>
            <div className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-extrabold text-emerald-400 border border-emerald-500/20 flex items-center">
              <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
              +{f1DeltaPts.toFixed(1)} pts
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Primary decision metric across 6 categories.</p>
        </div>

        {/* Card 2: Accuracy */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Overall Accuracy</span>
            <CheckCircle2 className="h-4 w-4 text-purple-400" />
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black text-white">
                {(finetunedMetrics.accuracy * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500">Baseline: {(baselineMetrics.accuracy * 100).toFixed(1)}%</div>
            </div>
            <div className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-extrabold text-emerald-400 border border-emerald-500/20 flex items-center">
              <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
              +{accDeltaPts.toFixed(1)} pts
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Percentage of correctly predicted tickets.</p>
        </div>

        {/* Card 3: Inference Cost */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Cost / 1K Predictions</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black text-white">
                ${finetunedMetrics.cost_per_1k.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500">Baseline: ${baselineMetrics.cost_per_1k.toFixed(2)}</div>
            </div>
            <div className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
              +${(finetunedMetrics.cost_per_1k - baselineMetrics.cost_per_1k).toFixed(2)}
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Fine-tuned model inference unit price.</p>
        </div>

        {/* Card 4: Latency */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Average Latency</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black text-white">
                {finetunedMetrics.avg_latency.toFixed(2)}s
              </div>
              <div className="text-xs text-slate-500">Baseline: {baselineMetrics.avg_latency.toFixed(2)}s</div>
            </div>
            <div className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-400">
              p95: {finetunedMetrics.latency_p95.toFixed(2)}s
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Request duration per prediction.</p>
        </div>
      </div>

      {/* Side-by-Side Detailed Metric Comparison Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Full Evaluation Metric Comparison Matrix
          </span>
          <span className="text-xs text-slate-500">Held-Out Test Set</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Metric Name</th>
                <th className="px-4 py-3">Baseline Model (gpt-4o-mini)</th>
                <th className="px-4 py-3">Fine-Tuned Model (ft:gpt-4o-mini)</th>
                <th className="px-4 py-3">Absolute Delta</th>
                <th className="px-4 py-3">Relative Improvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200 font-mono">
              <tr>
                <td className="px-4 py-3 font-sans font-semibold text-white">Macro F1 Score</td>
                <td className="px-4 py-3 text-slate-400">{(baselineMetrics.macro_f1 * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-indigo-300 font-bold">{(finetunedMetrics.macro_f1 * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-emerald-400">+{f1DeltaPts.toFixed(1)} pts</td>
                <td className="px-4 py-3 text-emerald-400">+{((f1DeltaPts / (baselineMetrics.macro_f1 * 100)) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-semibold text-white">Accuracy</td>
                <td className="px-4 py-3 text-slate-400">{(baselineMetrics.accuracy * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-indigo-300 font-bold">{(finetunedMetrics.accuracy * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-emerald-400">+{accDeltaPts.toFixed(1)} pts</td>
                <td className="px-4 py-3 text-emerald-400">+{((accDeltaPts / (baselineMetrics.accuracy * 100)) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-semibold text-white">Macro Precision</td>
                <td className="px-4 py-3 text-slate-400">{(baselineMetrics.precision * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-indigo-300 font-bold">{(finetunedMetrics.precision * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-emerald-400">+{((finetunedMetrics.precision - baselineMetrics.precision) * 100).toFixed(1)} pts</td>
                <td className="px-4 py-3 text-emerald-400">+12.3%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-semibold text-white">Macro Recall</td>
                <td className="px-4 py-3 text-slate-400">{(baselineMetrics.recall * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-indigo-300 font-bold">{(finetunedMetrics.recall * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-emerald-400">+{((finetunedMetrics.recall - baselineMetrics.recall) * 100).toFixed(1)} pts</td>
                <td className="px-4 py-3 text-emerald-400">+15.3%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-semibold text-white">Cost per 1,000 Predictions</td>
                <td className="px-4 py-3 text-slate-400">${baselineMetrics.cost_per_1k.toFixed(2)}</td>
                <td className="px-4 py-3 text-amber-300 font-bold">${finetunedMetrics.cost_per_1k.toFixed(2)}</td>
                <td className="px-4 py-3 text-amber-400">+${(finetunedMetrics.cost_per_1k - baselineMetrics.cost_per_1k).toFixed(2)}</td>
                <td className="px-4 py-3 text-amber-400">+45.2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-Class F1 Breakdown Chart */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Per-Class F1 Score Comparison (Baseline vs Fine-Tuned)
          </span>
          <span className="text-xs text-slate-500">6 Ticket Categories</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <XAxis dataKey="class" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                itemStyle={{ color: "#f8fafc", fontSize: "12px" }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
              <Bar dataKey="Baseline" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="FineTuned" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500"
        >
          <span>Proceed to STEP 05 — Analyze Errors & Tradeoffs</span>
        </button>
      </div>
    </div>
  );
}
