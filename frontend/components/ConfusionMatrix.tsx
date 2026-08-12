"use client";

import React, { useState } from "react";
import { MetricResults, ErrorDetail } from "@/types/experiment";
import { Grid, Eye, AlertCircle, Filter, ArrowRight } from "lucide-react";

interface ConfusionMatrixProps {
  metrics: MetricResults;
  detailedErrors: ErrorDetail[];
}

export function ConfusionMatrix({ metrics, detailedErrors }: ConfusionMatrixProps) {
  const labels = metrics.confusion_matrix_labels;
  const matrix = metrics.confusion_matrix;
  const normMatrix = metrics.normalized_confusion_matrix;

  const [selectedCell, setSelectedCell] = useState<{ actual: string; predicted: string } | null>(null);

  // Filter detailed errors corresponding to selected confusion cell
  const filteredCellErrors = selectedCell
    ? detailedErrors.filter(
        (err) => err.actual_label === selectedCell.actual && err.predicted_label === selectedCell.predicted
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Grid className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Interactive Confusion Matrix Heatmap</h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Click any cell to drill down into specific support tickets
          </span>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {/* Header Top Left Empty Cell */}
              <div className="p-2 text-[10px] font-bold text-slate-500 uppercase flex items-center justify-center">
                Actual \ Pred
              </div>

              {/* Column Headers (Predicted Labels) */}
              {labels.map((lbl) => (
                <div
                  key={`col-${lbl}`}
                  className="p-2 text-[11px] font-bold text-slate-300 bg-slate-950/80 rounded border border-slate-800/80 truncate"
                  title={lbl}
                >
                  {lbl}
                </div>
              ))}

              {/* Rows */}
              {labels.map((rowLabel, rIdx) => (
                <React.Fragment key={`row-${rowLabel}`}>
                  {/* Row Label (Actual) */}
                  <div
                    className="p-2 text-[11px] font-bold text-slate-300 bg-slate-950/80 rounded border border-slate-800/80 flex items-center justify-center truncate"
                    title={rowLabel}
                  >
                    {rowLabel}
                  </div>

                  {/* Cells */}
                  {labels.map((colLabel, cIdx) => {
                    const count = matrix[rIdx]?.[cIdx] ?? 0;
                    const normPct = (normMatrix[rIdx]?.[cIdx] ?? 0) * 100;
                    const isDiagonal = rIdx === cIdx;
                    const isSelected =
                      selectedCell?.actual === rowLabel && selectedCell?.predicted === colLabel;

                    // Color calculation based on intensity
                    let bgColor = "bg-slate-950/60 text-slate-400";
                    if (isDiagonal) {
                      if (normPct >= 85) bgColor = "bg-indigo-600/30 text-indigo-200 border-indigo-500/40";
                      else bgColor = "bg-indigo-700/20 text-indigo-300 border-indigo-500/30";
                    } else if (count > 0) {
                      bgColor = "bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30";
                    }

                    return (
                      <button
                        key={`cell-${rIdx}-${cIdx}`}
                        onClick={() => setSelectedCell({ actual: rowLabel, predicted: colLabel })}
                        className={`p-3 rounded border transition-all flex flex-col items-center justify-center ${bgColor} ${
                          isSelected ? "ring-2 ring-indigo-400 scale-95 shadow-lg" : ""
                        }`}
                      >
                        <span className="text-sm font-extrabold">{count}</span>
                        <span className="text-[10px] opacity-75">{normPct.toFixed(0)}%</span>
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Cell Filter Drilldown Banner */}
        {selectedCell && (
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300">
                <Filter className="h-4 w-4 text-indigo-400" />
                <span>
                  Filtered Cell: Actual <strong className="text-white">{selectedCell.actual}</strong> → Predicted <strong className="text-white">{selectedCell.predicted}</strong>
                </span>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Clear Filter
              </button>
            </div>

            {filteredCellErrors.length > 0 ? (
              <div className="space-y-2">
                {filteredCellErrors.map((err) => (
                  <div key={err.example_id} className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-mono text-slate-500">Ticket #{err.example_id}</span>
                      <span className="rounded bg-rose-500/10 px-2 py-0.5 text-rose-400 border border-rose-500/20 font-semibold">
                        Category: {err.error_category}
                      </span>
                    </div>
                    <p className="text-slate-200">{err.input_text}</p>
                    <p className="text-[11px] text-slate-400 italic">{err.explanation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                {selectedCell.actual === selectedCell.predicted
                  ? "No misclassifications in this correct prediction cell."
                  : "No specific ticket examples matched this confusion filter in current drilldown sample."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
