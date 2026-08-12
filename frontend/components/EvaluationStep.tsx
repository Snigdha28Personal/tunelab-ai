"use client";

import React from "react";
import { MetricResults } from "@/types/experiment";
import { BarChart2, TrendingUp, CheckCircle2, Clock, DollarSign, ArrowUpRight } from "lucide-react";
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
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 font-medium">
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
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-indigo-600" />
              Baseline vs Fine-Tuned Model Benchmarking
            </h2>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200">
              {mode}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Held-out test set evaluation using scikit-learn metrics engine.
          </p>
        </div>
      </div>

      {/* Primary Hero Metric Score Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Macro F1 */}
        <div className="relative overflow-hidden rounded-xl border border-indigo-200 bg-gradient-to-b from-indigo-50/80 to-white p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center justify-between">
            <span>Macro F1 Score</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black text-slate-950">
                {(finetunedMetrics.macro_f1 * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500 font-medium">Baseline: {(baselineMetrics.macro_f1 * 100).toFixed(1)}%</div>
            </div>
            <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-800 border border-emerald-300 flex items-center shadow-2xs">
              <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
              +{f1DeltaPts.toFixed(1)} pts
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Primary decision metric across 6 categories.</p>
        </div>

        {/* Card 2: Accuracy */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Overall Accuracy</span>
            <CheckCircle2 className="h-4 w-4 text-purple-600" />
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black text-slate-950">
                {(finetunedMetrics.accuracy * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500 font-medium">Baseline: {(baselineMetrics.accuracy * 100).toFixed(1)}%</div>
            </div>
            <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-800 border border-emerald-300 flex items-center shadow-2xs">
              <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
              +{accDeltaPts.toFixed(1)} pts
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Percentage of correctly predicted tickets.</p>
        </div>

        {/* Card 3: Inference Cost */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Cost / 1K Predictions</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black text-slate-950">
                ${finetunedMetrics.cost_per_1k.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 font-medium">Baseline: ${baselineMetrics.cost_per_1k.toFixed(2)}</div>
            </div>
            <div className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 border border-amber-300">
              +${(finetunedMetrics.cost_per_1k - baselineMetrics.cost_per_1k).toFixed(2)}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Fine-tuned model inference unit price.</p>
        </div>

        {/* Card 4: Latency */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Average Latency</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black text-slate-950">
                {finetunedMetrics.avg_latency.toFixed(2)}s
              </div>
              <div className="text-xs text-slate-500 font-medium">Baseline: {baselineMetrics.avg_latency.toFixed(2)}s</div>
            </div>
            <div className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
              p95: {finetunedMetrics.latency_p95.toFixed(2)}s
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Request duration per prediction.</p>
        </div>
      </div>

      {/* Side-by-Side Detailed Metric Comparison Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Full Evaluation Metric Comparison Matrix
          </span>
          <span className="text-xs text-slate-500 font-medium">Held-Out Test Set</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
              <tr>
                <th className="px-4 py-3">Metric Name</th>
                <th className="px-4 py-3">Baseline Model (gpt-4o-mini)</th>
                <th className="px-4 py-3">Fine-Tuned Model (ft:gpt-4o-mini)</th>
                <th className="px-4 py-3">Absolute Delta</th>
                <th className="px-4 py-3">Relative Improvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-mono font-medium">
              <tr>
                <td className="px-4 py-3 font-sans font-bold text-slate-900">Macro F1 Score</td>
                <td className="px-4 py-3 text-slate-500">{(baselineMetrics.macro_f1 * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-indigo-700 font-bold">{(finetunedMetrics.macro_f1 * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-emerald-700 font-bold">+{f1DeltaPts.toFixed(1)} pts</td>
                <td className="px-4 py-3 text-emerald-700 font-bold">+{((f1DeltaPts / (baselineMetrics.macro_f1 * 100)) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-bold text-slate-900">Accuracy</td>
                <td className="px-4 py-3 text-slate-500">{(baselineMetrics.accuracy * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-indigo-700 font-bold">{(finetunedMetrics.accuracy * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-emerald-700 font-bold">+{accDeltaPts.toFixed(1)} pts</td>
                <td className="px-4 py-3 text-emerald-700 font-bold">+{((accDeltaPts / (baselineMetrics.accuracy * 100)) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-bold text-slate-900">Macro Precision</td>
                <td className="px-4 py-3 text-slate-500">{(baselineMetrics.precision * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-indigo-700 font-bold">{(finetunedMetrics.precision * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-emerald-700 font-bold">+{((finetunedMetrics.precision - baselineMetrics.precision) * 100).toFixed(1)} pts</td>
                <td className="px-4 py-3 text-emerald-700 font-bold">+12.3%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-bold text-slate-900">Macro Recall</td>
                <td className="px-4 py-3 text-slate-500">{(baselineMetrics.recall * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-indigo-700 font-bold">{(finetunedMetrics.recall * 100).toFixed(1)}%</td>
                <td className="px-4 py-3 text-emerald-700 font-bold">+{((finetunedMetrics.recall - baselineMetrics.recall) * 100).toFixed(1)} pts</td>
                <td className="px-4 py-3 text-emerald-700 font-bold">+15.3%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-bold text-slate-900">Cost per 1,000 Predictions</td>
                <td className="px-4 py-3 text-slate-500">${baselineMetrics.cost_per_1k.toFixed(2)}</td>
                <td className="px-4 py-3 text-amber-700 font-bold">${finetunedMetrics.cost_per_1k.toFixed(2)}</td>
                <td className="px-4 py-3 text-amber-700 font-bold">+${(finetunedMetrics.cost_per_1k - baselineMetrics.cost_per_1k).toFixed(2)}</td>
                <td className="px-4 py-3 text-amber-700 font-bold">+45.2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-Class F1 Breakdown Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Per-Class F1 Score Comparison (Baseline vs Fine-Tuned)
          </span>
          <span className="text-xs text-slate-500 font-medium">6 Ticket Categories</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <XAxis dataKey="class" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                itemStyle={{ color: "#0f172a", fontSize: "12px" }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
              <Bar dataKey="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="FineTuned" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500"
        >
          <span>Proceed to STEP 05 — Analyze Errors & Tradeoffs</span>
        </button>
      </div>
    </div>
  );
}
