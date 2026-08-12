from fastapi import APIRouter
from typing import List, Dict, Any
from pydantic import BaseModel
from app.models.schemas import MetricResults, DatasetExample, ErrorAnalysisResponse
from app.evaluation.metrics import calculate_all_metrics
from app.evaluation.comparison import compare_metrics
from app.services.error_analysis import analyze_errors

router = APIRouter(prefix="/api/evaluation", tags=["evaluation"])


class MetricsRequest(BaseModel):
    y_true: List[str]
    y_pred: List[str]
    latencies: List[float] = []
    cost_per_1k: float = 0.50


class ComparisonRequest(BaseModel):
    baseline: MetricResults
    finetuned: MetricResults


class ErrorAnalysisApiRequest(BaseModel):
    test_examples: List[DatasetExample]
    predictions: List[str]
    class_support: Dict[str, int] = {}


@router.post("/metrics", response_model=MetricResults)
def compute_metrics_endpoint(request: MetricsRequest):
    """
    Computes scikit-learn classification metrics and confusion matrix.
    """
    return calculate_all_metrics(
        y_true=request.y_true,
        y_pred=request.y_pred,
        latencies=request.latencies,
        cost_per_1k=request.cost_per_1k
    )


@router.post("/compare")
def compare_metrics_endpoint(request: ComparisonRequest):
    """
    Computes absolute and relative deltas between Baseline and Fine-tuned models.
    """
    return compare_metrics(request.baseline, request.finetuned)


@router.post("/errors", response_model=ErrorAnalysisResponse)
def analyze_errors_endpoint(request: ErrorAnalysisApiRequest):
    """
    Performs failure mode categorization and error analysis.
    """
    return analyze_errors(
        test_examples=request.test_examples,
        predictions=request.predictions,
        class_support=request.class_support
    )
