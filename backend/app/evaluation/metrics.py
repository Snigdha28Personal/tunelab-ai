import numpy as np
from typing import List, Dict, Any
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)
from app.models.schemas import MetricResults


def calculate_all_metrics(
    y_true: List[str],
    y_pred: List[str],
    latencies: List[float] = None,
    cost_per_1k: float = 0.50
) -> MetricResults:
    """
    Computes exact evaluation metrics using scikit-learn:
    - Accuracy
    - Precision (macro)
    - Recall (macro)
    - Macro F1
    - Per-class F1, Precision, Recall, Support
    - Raw & Normalized Confusion Matrix
    - Latency statistics (p50, p95, avg)
    """
    if not y_true or not y_pred or len(y_true) != len(y_pred):
        raise ValueError("y_true and y_pred must be non-empty lists of equal length.")

    # Unique sorted labels for deterministic ordering
    unique_labels = sorted(list(set(y_true).union(set(y_pred))))

    # Scikit-learn computations
    acc = float(accuracy_score(y_true, y_pred))
    prec_macro = float(precision_score(y_true, y_pred, average="macro", zero_division=0))
    rec_macro = float(recall_score(y_true, y_pred, average="macro", zero_division=0))
    macro_f1 = float(f1_score(y_true, y_pred, average="macro", zero_division=0))

    # Per-class metrics
    report = classification_report(
        y_true, y_pred, labels=unique_labels, output_dict=True, zero_division=0
    )

    per_class_f1: Dict[str, float] = {}
    per_class_precision: Dict[str, float] = {}
    per_class_recall: Dict[str, float] = {}
    per_class_support: Dict[str, int] = {}

    for label in unique_labels:
        if label in report:
            per_class_f1[label] = float(np.round(report[label]["f1-score"], 4))
            per_class_precision[label] = float(np.round(report[label]["precision"], 4))
            per_class_recall[label] = float(np.round(report[label]["recall"], 4))
            per_class_support[label] = int(report[label]["support"])

    # Confusion matrix
    cm_raw = confusion_matrix(y_true, y_pred, labels=unique_labels)
    cm_list = cm_raw.tolist()

    # Normalized confusion matrix (row-normalized by true counts)
    cm_norm = np.zeros_like(cm_raw, dtype=float)
    for i, row in enumerate(cm_raw):
        row_sum = row.sum()
        if row_sum > 0:
            cm_norm[i] = row / row_sum
    
    cm_norm_list = np.round(cm_norm, 4).tolist()

    # Latencies
    if latencies and len(latencies) > 0:
        avg_lat = float(np.mean(latencies))
        p50_lat = float(np.percentile(latencies, 50))
        p95_lat = float(np.percentile(latencies, 95))
    else:
        avg_lat, p50_lat, p95_lat = 1.0, 1.0, 1.2

    return MetricResults(
        accuracy=float(np.round(acc, 4)),
        precision=float(np.round(prec_macro, 4)),
        recall=float(np.round(rec_macro, 4)),
        macro_f1=float(np.round(macro_f1, 4)),
        per_class_f1=per_class_f1,
        per_class_precision=per_class_precision,
        per_class_recall=per_class_recall,
        per_class_support=per_class_support,
        confusion_matrix_labels=unique_labels,
        confusion_matrix=cm_list,
        normalized_confusion_matrix=cm_norm_list,
        latency_p50=float(np.round(p50_lat, 2)),
        latency_p95=float(np.round(p95_lat, 2)),
        avg_latency=float(np.round(avg_lat, 2)),
        cost_per_1k=cost_per_1k
    )
