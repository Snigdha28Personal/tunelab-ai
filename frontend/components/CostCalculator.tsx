"use client";

import React, { useState } from "react";
import { Calculator } from "lucide-react";

export function CostCalculator() {
  const [monthlyVolume, setMonthlyVolume] = useState<number>(50000);
  const [avgTokens, setAvgTokens] = useState<number>(150);

  // Pricing constants (OpenAI gpt-4o-mini pricing)
  const baselineInputPricePer1M = 0.15;
  const baselineOutputPricePer1M = 0.60;

  const finetunedInputPricePer1M = 0.30;
  const finetunedOutputPricePer1M = 1.20;

  const outputTokens = 25;

  const baselineCostPer1k =
    (1000 * avgTokens / 1_000_000) * baselineInputPricePer1M +
    (1000 * outputTokens / 1_000_000) * baselineOutputPricePer1M;

  const finetunedCostPer1k =
    (1000 * avgTokens / 1_000_000) * finetunedInputPricePer1M +
    (1000 * outputTokens / 1_000_000) * finetunedOutputPricePer1M;

  const baselineMonthly = (monthlyVolume / 1000) * baselineCostPer1k;
  const finetunedMonthly = (monthlyVolume / 1000) * finetunedCostPer1k;
  const monthlyDelta = finetunedMonthly - baselineMonthly;
  const yearlyDelta = monthlyDelta * 12;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calculator className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">Dynamic Cost & Latency Tradeoff Calculator</h3>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">Interactive Volume Projections</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sliders */}
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>Monthly Prediction Volume</span>
              <span className="text-indigo-700 font-mono font-bold">{monthlyVolume.toLocaleString()} requests/mo</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="10000"
              value={monthlyVolume}
              onChange={(e) => setMonthlyVolume(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>Average Tokens per Prompt</span>
              <span className="text-purple-700 font-mono font-bold">{avgTokens} tokens</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={avgTokens}
              onChange={(e) => setAvgTokens(parseInt(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>
        </div>

        {/* Dynamic Output Cards */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 space-y-1">
            <span className="text-slate-500 block text-[11px] font-semibold">Baseline Monthly Cost</span>
            <span className="text-xl font-bold text-slate-900">${baselineMonthly.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500 font-medium block">${baselineCostPer1k.toFixed(3)} / 1K</span>
          </div>

          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 space-y-1">
            <span className="text-slate-500 block text-[11px] font-semibold">Fine-Tuned Monthly Cost</span>
            <span className="text-xl font-bold text-indigo-700">${finetunedMonthly.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500 font-medium block">${finetunedCostPer1k.toFixed(3)} / 1K</span>
          </div>

          <div className="col-span-2 rounded-lg bg-indigo-50 p-3.5 border border-indigo-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-900">Monthly Cost Delta</span>
              <div className="text-lg font-black text-indigo-950">+${monthlyDelta.toFixed(2)} / month</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-semibold block">Annualized Impact</span>
              <span className="text-sm font-extrabold text-emerald-700">+${yearlyDelta.toFixed(2)} / year</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
