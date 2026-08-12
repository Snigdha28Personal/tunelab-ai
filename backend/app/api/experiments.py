from fastapi import APIRouter
from app.models.schemas import ExperimentRunRequest, ExperimentRunResponse
from app.services.experiment_runner import run_experiment

router = APIRouter(prefix="/api/experiments", tags=["experiments"])


@router.post("/run", response_model=ExperimentRunResponse)
def run_experiment_endpoint(request: ExperimentRunRequest):
    """
    Executes the full end-to-end Python ML evaluation and product decision pipeline.
    """
    return run_experiment(request)
