"use client";

import React from "react";
import { MetricResults, ErrorAnalysisResponse } from "@/types/experiment";
import { ConfusionMatrix } from "./ConfusionMatrix";
import { CostCalculator } from "./CostCalculator";
import { ShieldAlert, AlertTriangle, Lightbulb, ListOrdered, Layers } from "lucide-react";

interface ErrorAnalysisStepProps {
  finetunedMetrics: MetricResults | null;
  errorAnalysis: ErrorAnalysisResponse | null;
  onNext: () => void;
}

export function ErrorAnalysisStep({ finetunedMetrics, errorAnalysis, onNext }: ErrorAnalysisStepProps) {
  if (!finetunedMetrics || !errorAnalysis) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
        Run experiment pipeline to view error analysis and cost tradeoffs.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-indigo-400" />
          Error Analysis & Failure Mode Categorization
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Identify root causes of remaining model errors and evaluate cost/latency tradeoffs.
        </p>
      </div>

      {/* Interactive Confusion Matrix Section */}
      <ConfusionMatrix metrics={finetunedMetrics} detailedErrors={errorAnalysis.detailed_errors} />

      {/* Top Failure Modes & PM Action Items */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Confusions */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">Top Misclassification Pairs</h3>
            </div>
            <span className="text-xs text-slate-500">{errorAnalysis.total_errors} Total Errors</span>
          </div>

          <div className="space-y-3">
            {errorAnalysis.top_confusions.map((item, idx) => (
              <div key={idx} className="rounded-lg bg-slate-950 p-3 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{item.pair}</div>
                  <div className="text-[10px] text-slate-400">
                    Actual: <span className="text-indigo-300">{item.actual}</span> → Predicted: <span className="text-rose-300">{item.predicted}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-rose-400">{item.count} errors</div>
                  <div className="text-[10px] text-slate-500">{item.pct_of_errors}% of errors</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable PM Recommendations */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">PM Action Items for Data Quality</h3>
              </div>
            </div>

            <div className="space-y-3 my-4">
              {errorAnalysis.dataset_action_items.map((item, i) => (
                <div key={i} className="flex items-start space-x-2 rounded-lg bg-indigo-500/10 p-3 border border-indigo-500/20 text-xs text-indigo-200">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 font-bold text-indigo-400 text-[10px]">
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 text-center">
            Derived from failure mode breakdown in Python error analysis engine
          </div>
        </div>
      </div>

      {/* Dynamic Interactive Cost & Volume Calculator */}
      <CostCalculator />

      {/* Action CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500"
        >
          <span>Proceed to STEP 06 — Product Decision Engine</span>
        </button>
      </div>
    </div>
  );
}
