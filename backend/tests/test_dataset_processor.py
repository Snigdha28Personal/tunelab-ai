import pytest
from app.models.schemas import DatasetExample
from app.services.dataset_processor import analyze_dataset_examples


def test_analyze_dataset_empty():
    res = analyze_dataset_examples([])
    assert res.total_examples == 0
    assert res.health_score == 0
    assert res.quality_grade == "Poor"


def test_analyze_dataset_valid():
    examples = [
        DatasetExample(id=1, input_text="Double charge on my bill.", label="billing"),
        DatasetExample(id=2, input_text="Cannot reset my password.", label="authentication"),
        DatasetExample(id=3, input_text="Double charge on my bill.", label="billing"),  # duplicate
        DatasetExample(id=4, input_text="", label="billing"),  # missing text
    ]
    res = analyze_dataset_examples(examples)
    assert res.total_examples == 4
    assert res.duplicate_rows == 1
    assert res.missing_values == 1
    assert "billing" in res.class_distribution
    assert res.health_score < 100
