import pytest
from app.models.schemas import MetricResults, EvaluationConfig, CostEstimateResponse
from app.services.decision_engine import decide_finetuning_strategy


def test_decision_recommended():
    baseline = MetricResults(
        accuracy=0.80, precision=0.78, recall=0.77, macro_f1=0.78,
        per_class_f1={}, per_class_precision={}, per_class_recall={}, per_class_support={},
        confusion_matrix_labels=[], confusion_matrix=[], normalized_confusion_matrix=[],
        latency_p50=1.0, latency_p95=1.2, avg_latency=1.1, cost_per_1k=0.42
    )

    finetuned = MetricResults(
        accuracy=0.90, precision=0.89, recall=0.88, macro_f1=0.89,
        per_class_f1={}, per_class_precision={}, per_class_recall={}, per_class_support={},
        confusion_matrix_labels=[], confusion_matrix=[], normalized_confusion_matrix=[],
        latency_p50=1.2, latency_p95=1.4, avg_latency=1.3, cost_per_1k=0.61
    )

    config = EvaluationConfig(
        target_macro_f1=0.85,
        max_cost_per_1k=1.00,
        max_latency_seconds=2.0,
        min_f1_improvement=0.05
    )

    cost_resp = CostEstimateResponse(
        training_cost=0.15, baseline_cost_per_1k=0.42, finetuned_cost_per_1k=0.61,
        baseline_monthly_cost=21.0, finetuned_monthly_cost=30.5, monthly_cost_delta=9.5,
        cost_ratio=1.45, pricing_assumptions={}
    )

    res = decide_finetuning_strategy(baseline, finetuned, config, cost_resp)
    assert res.decision == "RECOMMENDED"
    assert res.passes_target_f1 is True
    assert res.passes_min_improvement is True
    assert res.passes_cost_guardrail is True
    assert res.passes_latency_guardrail is True


def test_decision_not_recommended():
    baseline = MetricResults(
        accuracy=0.80, precision=0.78, recall=0.77, macro_f1=0.78,
        per_class_f1={}, per_class_precision={}, per_class_recall={}, per_class_support={},
        confusion_matrix_labels=[], confusion_matrix=[], normalized_confusion_matrix=[],
        latency_p50=1.0, latency_p95=1.2, avg_latency=1.1, cost_per_1k=0.42
    )

    # Barely any improvement
    finetuned = MetricResults(
        accuracy=0.81, precision=0.79, recall=0.78, macro_f1=0.79,
        per_class_f1={}, per_class_precision={}, per_class_recall={}, per_class_support={},
        confusion_matrix_labels=[], confusion_matrix=[], normalized_confusion_matrix=[],
        latency_p50=1.2, latency_p95=1.4, avg_latency=1.3, cost_per_1k=0.61
    )

    config = EvaluationConfig(target_macro_f1=0.85, min_f1_improvement=0.05)
    cost_resp = CostEstimateResponse(
        training_cost=0.15, baseline_cost_per_1k=0.42, finetuned_cost_per_1k=0.61,
        baseline_monthly_cost=21.0, finetuned_monthly_cost=30.5, monthly_cost_delta=9.5,
        cost_ratio=1.45, pricing_assumptions={}
    )

    res = decide_finetuning_strategy(baseline, finetuned, config, cost_resp)
    assert res.decision == "NOT_RECOMMENDED"
