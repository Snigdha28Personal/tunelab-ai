import pytest
from app.services.dataset_quality import calculate_dataset_quality_score


def test_quality_score_perfect():
    class_dist = {"billing": 25, "authentication": 25, "cancellation": 25, "technical_issue": 25}
    res = calculate_dataset_quality_score(
        total_examples=100,
        num_classes=4,
        missing_values=0,
        duplicate_rows=0,
        class_distribution=class_dist,
        text_lengths=[120] * 100
    )
    assert res["health_score"] >= 90
    assert res["quality_grade"] == "Excellent"


def test_quality_score_imbalanced():
    class_dist = {"billing": 90, "authentication": 10}
    res = calculate_dataset_quality_score(
        total_examples=100,
        num_classes=2,
        missing_values=5,
        duplicate_rows=15,
        class_distribution=class_dist,
        text_lengths=[5] * 100
    )
    assert res["health_score"] < 80
    assert len(res["warnings"]) > 0
