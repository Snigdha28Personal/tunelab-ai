import numpy as np
from typing import Dict, Any
from app.models.schemas import MetricResults


def compare_metrics(baseline: MetricResults, finetuned: MetricResults) -> Dict[str, Any]:
    """
    Calculates absolute, relative, and percentage point deltas between
    Baseline and Fine-Tuned model metrics.
    """
    # Macro F1 deltas
    f1_diff = finetuned.macro_f1 - baseline.macro_f1
    f1_relative_pct = (f1_diff / baseline.macro_f1 * 100.0) if baseline.macro_f1 > 0 else 0.0

    # Accuracy deltas
    acc_diff = finetuned.accuracy - baseline.accuracy
    acc_relative_pct = (acc_diff / baseline.accuracy * 100.0) if baseline.accuracy > 0 else 0.0

    # Precision & Recall deltas
    prec_diff = finetuned.precision - baseline.precision
    rec_diff = finetuned.recall - baseline.recall

    # Cost & Latency deltas
    cost_delta = finetuned.cost_per_1k - baseline.cost_per_1k
    cost_increase_pct = (cost_delta / baseline.cost_per_1k * 100.0) if baseline.cost_per_1k > 0 else 0.0
    
    latency_delta = finetuned.avg_latency - baseline.avg_latency

    # Error reduction calculation
    baseline_error_rate = 1.0 - baseline.accuracy
    finetuned_error_rate = 1.0 - finetuned.accuracy
    
    if baseline_error_rate > 0:
        error_reduction_pct = (baseline_error_rate - finetuned_error_rate) / baseline_error_rate * 100.0
    else:
        error_reduction_pct = 0.0

    # Per-class F1 deltas
    per_class_deltas: Dict[str, float] = {}
    for cls in finetuned.per_class_f1:
        base_f1 = baseline.per_class_f1.get(cls, 0.0)
        ft_f1 = finetuned.per_class_f1.get(cls, 0.0)
        per_class_deltas[cls] = float(np.round(ft_f1 - base_f1, 4))

    return {
        "macro_f1_absolute_diff": float(np.round(f1_diff, 4)),
        "macro_f1_percentage_points": float(np.round(f1_diff * 100.0, 1)),
        "macro_f1_relative_pct": float(np.round(f1_relative_pct, 2)),
        "accuracy_absolute_diff": float(np.round(acc_diff, 4)),
        "accuracy_percentage_points": float(np.round(acc_diff * 100.0, 1)),
        "accuracy_relative_pct": float(np.round(acc_relative_pct, 2)),
        "precision_diff": float(np.round(prec_diff, 4)),
        "recall_diff": float(np.round(rec_diff, 4)),
        "cost_delta_per_1k": float(np.round(cost_delta, 2)),
        "cost_increase_pct": float(np.round(cost_increase_pct, 1)),
        "latency_delta_seconds": float(np.round(latency_delta, 2)),
        "error_reduction_pct": float(np.round(error_reduction_pct, 1)),
        "per_class_f1_deltas": per_class_deltas
    }
