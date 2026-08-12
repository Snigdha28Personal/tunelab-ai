import pytest
from app.models.schemas import CostEstimateRequest
from app.services.cost_estimator import estimate_costs


def test_cost_estimation():
    req = CostEstimateRequest(
        num_training_examples=150,
        avg_tokens_per_example=150,
        num_epochs=3,
        monthly_prediction_volume=50000
    )
    res = estimate_costs(req)

    assert res.training_cost > 0
    assert res.baseline_cost_per_1k > 0
    assert res.finetuned_cost_per_1k > res.baseline_cost_per_1k
    assert res.monthly_cost_delta > 0
