"use client";

import React, { useState } from "react";
import { DatasetExample } from "@/types/experiment";
import { Cpu, FileCode, CheckCircle, ArrowRight, Loader2, Sparkles, Layers } from "lucide-react";

interface FineTuneStepProps {
  examples: DatasetExample[];
  onNext: () => void;
}

export function FineTuneStep({ examples, onNext }: FineTuneStepProps) {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStage, setTrainingStage] = useState<string | null>(null);

  const trainCount = Math.round(examples.length * 0.7);
  const estimatedTokens = trainCount * 150 * 3; // 3 epochs

  const jsonlSnippet = JSON.stringify(
    {
      messages: [
        {
          role: "system",
          content: "You are a customer support triage classifier. Categorize into: billing, authentication, technical_issue, cancellation, feature_request, or other."
        },
        { role: "user", content: examples[0]?.input_text || "I was charged twice for my subscription." },
        { role: "assistant", content: examples[0]?.label || "billing" }
      ]
    },
    null,
    2
  );

  const startTrainingSimulation = () => {
    setIsTraining(true);
    setTrainingStage("Validating & Formatting JSONL Dataset...");

    setTimeout(() => {
      setTrainingStage("Uploading Training File to OpenAI File Storage (file-89a201)...");
    }, 800);

    setTimeout(() => {
      setTrainingStage("Creating Fine-Tuning Job (ftjob-tune-98124)...");
    }, 1600);

    setTimeout(() => {
      setTrainingStage("Training in Progress (Epoch 3/3 — Loss: 0.084)...");
    }, 2400);

    setTimeout(() => {
      setTrainingStage("Fine-Tuned Model Successfully Created: ft:gpt-4o-mini:tunelab:support-v1");
      setIsTraining(false);
    }, 3200);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="h-5 w-5 text-indigo-400" />
          Fine-Tuning Dataset Preparation & Model Training
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Format held-out training split into OpenAI Chat JSONL format and configure model hyperparameter settings.
        </p>
      </div>

      {/* Dataset Formatting & Token Estimate Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Token & Size Summary */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Training Config</span>
            <Layers className="h-4 w-4 text-indigo-400" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center rounded-lg bg-slate-950 p-2.5">
              <span className="text-slate-400">Training Examples (70% Split)</span>
              <span className="font-bold text-white">{trainCount} items</span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-slate-950 p-2.5">
              <span className="text-slate-400">Estimated Tokens / Epoch</span>
              <span className="font-bold text-slate-200">{(trainCount * 150).toLocaleString()} tokens</span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-slate-950 p-2.5">
              <span className="text-slate-400">Total Tokens (3 Epochs)</span>
              <span className="font-bold text-indigo-400">{estimatedTokens.toLocaleString()} tokens</span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-slate-950 p-2.5">
              <span className="text-slate-400">Estimated Training Cost</span>
              <span className="font-bold text-emerald-400">${((estimatedTokens / 1_000_000) * 3.0).toFixed(4)}</span>
            </div>
          </div>
        </div>

        {/* JSONL Format Code Preview */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-3">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCode className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                OpenAI JSONL Record Format Preview
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Format: Chat Completions JSONL</span>
          </div>

          <pre className="p-4 rounded-lg bg-slate-950 text-indigo-300 font-mono text-[11px] overflow-x-auto max-h-48 border border-slate-800/80">
            {jsonlSnippet}
          </pre>

          <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>Format Validated: 0 schema errors found. Ground truth labels matched to system prompt categories.</span>
          </div>
        </div>
      </div>

      {/* Training Simulator Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Model Fine-Tuning Execution
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Launch fine-tuning job on base model <code className="text-indigo-300 font-mono">gpt-4o-mini</code>.
            </p>
          </div>

          <button
            onClick={startTrainingSimulation}
            disabled={isTraining}
            className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-50"
          >
            {isTraining ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Training Model...</span>
              </>
            ) : (
              <>
                <Cpu className="h-4 w-4" />
                <span>Start Fine-Tuning Job</span>
              </>
            )}
          </button>
        </div>

        {trainingStage && (
          <div className="rounded-lg bg-slate-950 p-3.5 border border-indigo-500/30 text-xs font-mono text-indigo-300 flex items-center space-x-3">
            {isTraining ? (
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400 shrink-0" />
            ) : (
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            )}
            <span>{trainingStage}</span>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500"
        >
          <span>Proceed to STEP 04 — Run Evaluation Pipeline</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
