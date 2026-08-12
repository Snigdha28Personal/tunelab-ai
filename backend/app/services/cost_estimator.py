import numpy as np
from app.models.schemas import CostEstimateRequest, CostEstimateResponse


def estimate_costs(request: CostEstimateRequest) -> CostEstimateResponse:
    """
    Computes precise fine-tuning training and inference costs,
    comparing baseline prompting vs fine-tuned model costs per 1K predictions
    and monthly volume projections.
    """
    # Token assumptions per prediction
    avg_input_tokens = request.avg_tokens_per_example
    avg_output_tokens = 25  # short classification output tag

    # OpenAI default pricing table (per 1M tokens)
    PRICING = {
        "training_per_1m": 3.00,             # gpt-4o-mini fine-tuning training
        "baseline_input_per_1m": 0.15,       # gpt-4o-mini base input
        "baseline_output_per_1m": 0.60,      # gpt-4o-mini base output
        "finetuned_input_per_1m": 0.30,      # ft:gpt-4o-mini input
        "finetuned_output_per_1m": 1.20,     # ft:gpt-4o-mini output
    }

    # 1. Training Cost calculation
    total_training_tokens = (
        request.num_training_examples * (avg_input_tokens + avg_output_tokens) * request.num_epochs
    )
    training_cost = (total_training_tokens / 1_000_000) * PRICING["training_per_1m"]
    training_cost = max(0.01, float(np.round(training_cost, 4)))

    # 2. Cost per 1,000 predictions calculation
    baseline_cost_per_1k = (
        (1000 * avg_input_tokens / 1_000_000) * PRICING["baseline_input_per_1m"]
        + (1000 * avg_output_tokens / 1_000_000) * PRICING["baseline_output_per_1m"]
    )

    finetuned_cost_per_1k = (
        (1000 * avg_input_tokens / 1_000_000) * PRICING["finetuned_input_per_1m"]
        + (1000 * avg_output_tokens / 1_000_000) * PRICING["finetuned_output_per_1m"]
    )

    baseline_cost_per_1k = float(np.round(baseline_cost_per_1k, 4))
    finetuned_cost_per_1k = float(np.round(finetuned_cost_per_1k, 4))

    # 3. Monthly Cost Projections
    monthly_vol = request.monthly_prediction_volume
    baseline_monthly = (monthly_vol / 1000.0) * baseline_cost_per_1k
    finetuned_monthly = (monthly_vol / 1000.0) * finetuned_cost_per_1k
    
    monthly_cost_delta = finetuned_monthly - baseline_monthly
    cost_ratio = (finetuned_cost_per_1k / baseline_cost_per_1k) if baseline_cost_per_1k > 0 else 1.0

    return CostEstimateResponse(
        training_cost=training_cost,
        baseline_cost_per_1k=baseline_cost_per_1k,
        finetuned_cost_per_1k=finetuned_cost_per_1k,
        baseline_monthly_cost=float(np.round(baseline_monthly, 2)),
        finetuned_monthly_cost=float(np.round(finetuned_monthly, 2)),
        monthly_cost_delta=float(np.round(monthly_cost_delta, 2)),
        cost_ratio=float(np.round(cost_ratio, 2)),
        pricing_assumptions=PRICING
    )
