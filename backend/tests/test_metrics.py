import pytest
from app.evaluation.metrics import calculate_all_metrics


def test_calculate_all_metrics_perfect():
    y_true = ["billing", "authentication", "billing", "cancellation"]
    y_pred = ["billing", "authentication", "billing", "cancellation"]

    res = calculate_all_metrics(y_true, y_pred)
    assert res.accuracy == 1.0
    assert res.macro_f1 == 1.0
    assert res.precision == 1.0
    assert res.recall == 1.0
    assert len(res.confusion_matrix_labels) == 3


def test_calculate_all_metrics_imperfect():
    y_true = ["billing", "billing", "authentication", "cancellation"]
    y_pred = ["billing", "cancellation", "authentication", "cancellation"]

    res = calculate_all_metrics(y_true, y_pred)
    assert res.accuracy == 0.75
    assert res.macro_f1 < 1.0
    assert res.per_class_f1["billing"] < 1.0
