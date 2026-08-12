from fastapi import APIRouter
from app.models.schemas import ProductDecisionRequest, ProductDecisionResponse
from app.services.decision_engine import decide_finetuning_strategy

router = APIRouter(prefix="/api/decisions", tags=["decisions"])


@router.post("/evaluate", response_model=ProductDecisionResponse)
def evaluate_decision_endpoint(request: ProductDecisionRequest):
    """
    Evaluates experiment results against business criteria and guardrails.
    """
    return decide_finetuning_strategy(
        baseline_metrics=request.baseline_metrics,
        finetuned_metrics=request.finetuned_metrics,
        config=request.config,
        cost_metrics=request.cost_metrics
    )
