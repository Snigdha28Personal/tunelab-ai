"use client";

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

export const WORKFLOW_STEPS = [
  { id: 1, key: "dataset", label: "01 Dataset", description: "Validate & Score Data" },
  { id: 2, key: "baseline", label: "02 Baseline", description: "Hypothesis & SLA Setup" },
  { id: 3, key: "finetune", label: "03 Fine-Tune", description: "JSONL & Training" },
  { id: 4, key: "evaluate", label: "04 Evaluate", description: "scikit-learn Metrics" },
  { id: 5, key: "analyze", label: "05 Analyze", description: "Error & Cost Tradeoff" },
  { id: 6, key: "decide", label: "06 Decide", description: "Product Decision Engine" },
  { id: 7, key: "rollout", label: "07 Rollout", description: "Multi-Phase Rollout Plan" },
];

interface StepperProps {
  currentStep: number;
  onSelectStep: (stepId: number) => void;
  completedSteps: number[];
}

export function Stepper({ currentStep, onSelectStep, completedSteps }: StepperProps) {
  return (
    <div className="border-b border-slate-200 bg-white/70 py-3 backdrop-blur-sm shadow-xs overflow-x-auto">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        {WORKFLOW_STEPS.map((step) => {
          const isCurrent = step.id === currentStep;
          const isCompleted = completedSteps.includes(step.id);

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`group flex items-center space-x-2.5 rounded-lg px-3 py-2 text-left transition-all ${
                isCurrent
                  ? "bg-indigo-50 border border-indigo-200 text-indigo-900 shadow-xs"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex h-7 w-7 items-center justify-center">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="h-4 w-4 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                )}
              </div>
              <div className="hidden sm:block">
                <div className={`text-xs font-bold ${isCurrent ? "text-indigo-700" : "text-slate-800"}`}>
                  {step.label}
                </div>
                <div className="text-[10px] text-slate-500 font-medium leading-none">{step.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
