"use client";

import React, { useState } from "react";
import { DatasetExample, DatasetAnalysisResponse } from "@/types/experiment";
import { Upload, Database, AlertTriangle, CheckCircle, ShieldAlert, FileText, Search, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface DatasetStepProps {
  examples: DatasetExample[];
  analysis: DatasetAnalysisResponse | null;
  onUpload: (file: File) => void;
  onUseDemo: () => void;
  onNext: () => void;
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#10b981", "#06b6d4"];

export function DatasetStep({ examples, analysis, onUpload, onUseDemo, onNext }: DatasetStepProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExamples = examples.filter(
    (e) =>
      e.input_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = analysis
    ? Object.keys(analysis.class_distribution).map((label, idx) => ({
        label,
        count: analysis.class_distribution[label],
        pct: analysis.class_percentages[label] || 0,
        color: COLORS[idx % COLORS.length]
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-400" />
            Dataset Selection & Health Validation
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Upload custom CSV/JSONL or inspect the pre-loaded 220 customer support ticket dataset.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onUseDemo}
            className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>Load Demo Dataset (220 Items)</span>
          </button>

          <label className="flex cursor-pointer items-center space-x-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-700 hover:text-white">
            <Upload className="h-4 w-4 text-slate-400" />
            <span>Upload CSV / JSONL</span>
            <input
              type="file"
              accept=".csv,.jsonl"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onUpload(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Dataset Health Scorecard & Stats */}
      {analysis && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Health Score Card */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Dataset Quality Score
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                    analysis.health_score >= 85
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : analysis.health_score >= 70
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  Grade: {analysis.quality_grade}
                </span>
              </div>

              <div className="my-6 flex items-center justify-center space-x-6">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-slate-950 ring-8 ring-indigo-500/20 shadow-inner">
                  <div className="text-center">
                    <span className="text-4xl font-black text-white">{analysis.health_score}</span>
                    <span className="text-xs text-slate-500 block">/ 100</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">Completeness (30%)</span>
                    <span className="font-semibold text-slate-200">{analysis.score_breakdown.completeness}/30</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">Class Balance (20%)</span>
                    <span className="font-semibold text-slate-200">{analysis.score_breakdown.class_balance}/20</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">Duplicates (20%)</span>
                    <span className="font-semibold text-slate-200">{analysis.score_breakdown.duplicate_rate}/20</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">Consistency (15%)</span>
                    <span className="font-semibold text-slate-200">{analysis.score_breakdown.label_consistency}/15</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">Text Quality (15%)</span>
                    <span className="font-semibold text-slate-200">{analysis.score_breakdown.text_quality}/15</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-slate-800 pt-3 text-center text-xs">
              <div className="rounded-lg bg-slate-950/60 p-2">
                <div className="text-[10px] text-slate-500">Total Rows</div>
                <div className="font-bold text-white">{analysis.total_examples}</div>
              </div>
              <div className="rounded-lg bg-slate-950/60 p-2">
                <div className="text-[10px] text-slate-500">Classes</div>
                <div className="font-bold text-white">{analysis.num_classes}</div>
              </div>
              <div className="rounded-lg bg-slate-950/60 p-2">
                <div className="text-[10px] text-slate-500">Avg Length</div>
                <div className="font-bold text-white">{analysis.average_text_length} chars</div>
              </div>
            </div>
          </div>

          {/* Class Distribution Chart */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg flex flex-col justify-between">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Class Imbalance & Support Distribution
              </span>
              <span className="text-xs text-slate-500">{analysis.num_classes} Categories</span>
            </div>
            <div className="h-52 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="label" stroke="#64748b" fontSize={10} angle={-25} textAnchor="end" />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                    itemStyle={{ color: "#f8fafc", fontSize: "12px" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] border-t border-slate-800 pt-2">
              {chartData.map((item) => (
                <div key={item.label} className="flex items-center space-x-1 text-slate-400">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.label}: <strong className="text-slate-200">{item.count}</strong> ({item.pct}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings & PM Recommendations */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg flex flex-col justify-between">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Data Quality Audit & Warnings
              </span>
            </div>
            <div className="space-y-3 my-3 text-xs overflow-y-auto max-h-56 pr-1">
              {analysis.warnings.length > 0 ? (
                analysis.warnings.map((w, i) => (
                  <div key={i} className="flex items-start space-x-2 rounded-lg bg-amber-500/10 p-2.5 border border-amber-500/20 text-amber-300">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-2 rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>No severe dataset warnings detected.</span>
                </div>
              )}

              {analysis.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start space-x-2 rounded-lg bg-indigo-500/10 p-2.5 border border-indigo-500/20 text-indigo-300">
                  <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>PM Tip:</strong> {rec}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 text-center">
              Evaluated programmatically in Python
            </div>
          </div>
        </div>
      )}

      {/* Dataset Records Table Viewer */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Dataset Records Viewer</h3>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
              {examples.length} records
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by text or label..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none sm:w-64"
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-2.5 w-16">ID</th>
                <th className="px-4 py-2.5">Input Text</th>
                <th className="px-4 py-2.5 w-36">Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredExamples.slice(0, 30).map((ex) => (
                <tr key={ex.id} className="hover:bg-slate-900/40">
                  <td className="px-4 py-2 font-mono text-slate-500">#{ex.id}</td>
                  <td className="px-4 py-2 max-w-lg truncate">{ex.input_text}</td>
                  <td className="px-4 py-2">
                    <span className="inline-block rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-300">
                      {ex.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500"
        >
          <span>Proceed to STEP 02 — Define Baseline Hypothesis</span>
        </button>
      </div>
    </div>
  );
}
