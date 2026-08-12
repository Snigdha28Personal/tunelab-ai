"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Stepper, WORKFLOW_STEPS } from "@/components/Stepper";
import { DatasetStep } from "@/components/DatasetStep";
import { BaselineStep } from "@/components/BaselineStep";
import { FineTuneStep } from "@/components/FineTuneStep";
import { EvaluationStep } from "@/components/EvaluationStep";
import { ErrorAnalysisStep } from "@/components/ErrorAnalysisStep";
import { DecisionStep } from "@/components/DecisionStep";
import { RolloutStep } from "@/components/RolloutStep";
import { AboutModal } from "@/components/AboutModal";
import {
  DatasetExample,
  DatasetAnalysisResponse,
  EvaluationConfig,
  ExperimentRunResponse
} from "@/types/experiment";
import { fetchDemoDataset, analyzeDatasetApi, runExperimentApi } from "@/lib/api";
import { Loader2, Play, Sparkles } from "lucide-react";

export default function Home() {
  const [useDemoMode, setUseDemoMode] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const [examples, setExamples] = useState<DatasetExample[]>([]);
  const [analysis, setAnalysis] = useState<DatasetAnalysisResponse | null>(null);

  const [config, setConfig] = useState<EvaluationConfig>({
    target_macro_f1: 0.85,
    max_cost_per_1k: 1.0,
    max_latency_seconds: 2.0,
    min_f1_improvement: 0.05,
    hypothesis:
      "Fine-tuning will improve support-ticket classification Macro F1 by at least 5 percentage points compared with baseline prompting."
  });

  const [isRunningExperiment, setIsRunningExperiment] = useState(false);
  const [experimentResult, setExperimentResult] = useState<ExperimentRunResponse | null>(null);

  // Load initial demo dataset on mount
  useEffect(() => {
    loadDemo();
  }, []);

  const loadDemo = async () => {
    const data = await fetchDemoDataset();
    setExamples(data);
    const analysisRes = await analyzeDatasetApi(data);
    setAnalysis(analysisRes);
  };

  const handleFileUpload = async (file: File) => {
    // Basic CSV parser fallback for client uploaded files
    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    const parsed: DatasetExample[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",");
      if (parts.length >= 2) {
        const txt = parts.slice(1, -1).join(",").replace(/^"|"$/g, "").trim() || parts[1];
        const lbl = parts[parts.length - 1].replace(/^"|"$/g, "").trim();
        parsed.push({ id: i, input_text: txt, label: lbl });
      }
    }

    if (parsed.length > 0) {
      setExamples(parsed);
      const analysisRes = await analyzeDatasetApi(parsed);
      setAnalysis(analysisRes);
    }
  };

  const handleRunPipeline = async () => {
    setIsRunningExperiment(true);
    try {
      const res = await runExperimentApi({
        experiment_name: "Customer Support Ticket Classification",
        use_demo_mode: useDemoMode,
        examples: examples,
        config: config,
        monthly_volume: 50000
      });
      setExperimentResult(res);

      // Mark steps completed
      setCompletedSteps([1, 2, 3, 4, 5, 6, 7]);
      setCurrentStep(4); // Jump to evaluation dashboard
    } catch (err) {
      console.error("Experiment run failed:", err);
    } finally {
      setIsRunningExperiment(false);
    }
  };

  const markCompleted = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Navbar */}
      <Header
        useDemoMode={useDemoMode}
        setUseDemoMode={setUseDemoMode}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Workflow Stepper */}
      <Stepper
        currentStep={currentStep}
        onSelectStep={(id) => setCurrentStep(id)}
        completedSteps={completedSteps}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Top Experiment Trigger Action Bar */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-white to-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-950">
                Experiment: Customer Support Ticket Classification
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Evaluating {examples.length} tickets across 6 categories using Python scikit-learn ML pipeline.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunPipeline}
            disabled={isRunningExperiment || examples.length === 0}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-2.5 font-extrabold text-white shadow-md shadow-indigo-500/25 hover:brightness-110 disabled:opacity-50 transition-all shrink-0 text-xs"
          >
            {isRunningExperiment ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Running Python ML Engine...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Execute Full Experiment Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* Step Views */}
        {currentStep === 1 && (
          <DatasetStep
            examples={examples}
            analysis={analysis}
            onUpload={handleFileUpload}
            onUseDemo={loadDemo}
            onNext={() => {
              markCompleted(1);
              setCurrentStep(2);
            }}
          />
        )}

        {currentStep === 2 && (
          <BaselineStep
            config={config}
            setConfig={setConfig}
            onNext={() => {
              markCompleted(2);
              setCurrentStep(3);
            }}
          />
        )}

        {currentStep === 3 && (
          <FineTuneStep
            examples={examples}
            onNext={async () => {
              markCompleted(3);
              if (!experimentResult) {
                await handleRunPipeline();
              } else {
                setCurrentStep(4);
              }
            }}
          />
        )}

        {currentStep === 4 && (
          <EvaluationStep
            baselineMetrics={experimentResult?.baseline_metrics || null}
            finetunedMetrics={experimentResult?.finetuned_metrics || null}
            comparisonDeltas={experimentResult?.comparison_deltas || null}
            mode={experimentResult?.mode || "DEMO MODE (Python Engine)"}
            onNext={() => {
              markCompleted(4);
              setCurrentStep(5);
            }}
          />
        )}

        {currentStep === 5 && (
          <ErrorAnalysisStep
            finetunedMetrics={experimentResult?.finetuned_metrics || null}
            errorAnalysis={experimentResult?.error_analysis || null}
            onNext={() => {
              markCompleted(5);
              setCurrentStep(6);
            }}
          />
        )}

        {currentStep === 6 && (
          <DecisionStep
            decision={experimentResult?.decision || null}
            baselineMetrics={experimentResult?.baseline_metrics || null}
            finetunedMetrics={experimentResult?.finetuned_metrics || null}
            config={config}
            onNext={() => {
              markCompleted(6);
              setCurrentStep(7);
            }}
          />
        )}

        {currentStep === 7 && (
          <RolloutStep
            rolloutPlan={experimentResult?.rollout_plan || null}
            onRestart={() => {
              setCurrentStep(1);
              setCompletedSteps([1]);
              setExperimentResult(null);
            }}
          />
        )}
      </main>

      {/* Portfolio & Interview Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
