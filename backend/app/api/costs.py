from fastapi import APIRouter
from app.models.schemas import CostEstimateRequest, CostEstimateResponse
from app.services.cost_estimator import estimate_costs

router = APIRouter(prefix="/api/costs", tags=["costs"])


@router.post("/estimate", response_model=CostEstimateResponse)
def estimate_cost_endpoint(request: CostEstimateRequest):
    """
    Computes training, inference, and monthly cost projections.
    """
    return estimate_costs(request)
