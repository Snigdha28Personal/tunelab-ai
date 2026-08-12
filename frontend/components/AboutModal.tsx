"use client";

import React from "react";
import { X, Layers, Code, Sparkles, HelpCircle, CheckCircle2, Award, Cpu } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Layers className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">About TuneLab — PM Portfolio Showcase</h2>
            <p className="text-xs text-slate-400">
              Demonstrating AI Product Management, ML Evaluation Engineering, and Full-Stack Execution
            </p>
          </div>
        </div>

        {/* Core Product Story */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h3 className="font-bold text-indigo-400 uppercase tracking-wider text-[11px]">Product Problem</h3>
            <p className="text-slate-300 leading-relaxed">
              AI teams frequently rush to fine-tune LLMs without first establishing whether customization actually improves product quality enough to justify higher inference costs, training overhead, and engineering complexity.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h3 className="font-bold text-purple-400 uppercase tracking-wider text-[11px]">Product Solution</h3>
            <p className="text-slate-300 leading-relaxed">
              TuneLab provides an automated Python evaluation pipeline that benchmarks baseline prompting against fine-tuned models on held-out test sets, executing scikit-learn metrics, confusion-matrix error analysis, cost modeling, and business guardrails.
            </p>
          </div>
        </div>

        {/* Key Competencies Demonstrated */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-400" />
            Core PM & Engineering Competencies Demonstrated
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800 text-slate-300 font-semibold">
              • AI Product Strategy
            </div>
            <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800 text-slate-300 font-semibold">
              • LLM Evaluation Pipeline
            </div>
            <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800 text-slate-300 font-semibold">
              • Python & FastAPI Backend
            </div>
            <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800 text-slate-300 font-semibold">
              • scikit-learn Metrics
            </div>
            <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800 text-slate-300 font-semibold">
              • Data Quality & Leakage
            </div>
            <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800 text-slate-300 font-semibold">
              • Error Mode Analysis
            </div>
            <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800 text-slate-300 font-semibold">
              • Unit Cost Modeling
            </div>
            <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800 text-slate-300 font-semibold">
              • Full-Stack UX Design
            </div>
          </div>
        </div>

        {/* 5 PM Interview Talking Points */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            Five PM Interview Talking Points
          </h3>

          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
              <strong className="text-indigo-300 font-bold block">1. Why compare against a baseline?</strong>
              <p className="text-slate-300">
                Baseline prompting is faster to deploy and cheaper to maintain. Comparing against a baseline ensures we only introduce fine-tuning when standard prompt engineering fails to meet SLA requirements.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
              <strong className="text-indigo-300 font-bold block">2. Why held-out test sets & data leakage prevention?</strong>
              <p className="text-slate-300">
                Evaluating models on training data leads to severe overfitting bias. TuneLab uses deterministic stratified splits and checks ID set intersections to guarantee true out-of-sample evaluation.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
              <strong className="text-indigo-300 font-bold block">3. Why Macro F1 instead of simple accuracy?</strong>
              <p className="text-slate-300">
                In real-world datasets with class imbalance, accuracy can be misleading (e.g. 90% accuracy on a majority class while failing completely on critical cancellation tickets). Macro F1 weights all classes equally.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
              <strong className="text-indigo-300 font-bold block">4. Why evaluate cost & latency alongside quality?</strong>
              <p className="text-slate-300">
                A model with a +2% benchmark improvement that costs 5x more or breaches latency SLAs is a bad product decision. Product decisions must balance quality, unit economics, latency, and operational risk.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
              <strong className="text-indigo-300 font-bold block">5. What is the core AI product decision philosophy?</strong>
              <p className="text-slate-300 font-semibold text-emerald-300">
                "Don't fine-tune because you can. Fine-tune when measured product quality, business impact, and risk reduction justify its additional cost and complexity."
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            Close Portfolio Guide
          </button>
        </div>
      </div>
    </div>
  );
}
