import pytest
from app.models.schemas import DatasetExample
from app.services.error_analysis import analyze_errors


def test_analyze_errors():
    test_examples = [
        DatasetExample(id=1, input_text="I was charged twice on my credit card.", label="billing"),
        DatasetExample(id=2, input_text="Cancel subscription immediately.", label="cancellation"),
    ]
    # Predict billing as cancellation for example #1
    predictions = ["cancellation", "cancellation"]

    res = analyze_errors(test_examples, predictions)
    assert res.total_errors == 1
    assert res.error_rate == 0.5
    assert len(res.top_confusions) > 0
    assert res.top_confusions[0]["actual"] == "billing"
    assert res.top_confusions[0]["predicted"] == "cancellation"
