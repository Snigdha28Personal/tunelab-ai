from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class DatasetExample(BaseModel):
    id: int
    input_text: str
    label: str


class DatasetAnalysisRequest(BaseModel):
    examples: List[DatasetExample]
    text_column: str = "input_text"
    label_column: str = "label"


class DatasetAnalysisResponse(BaseModel):
    total_examples: int
    num_classes: int
    missing_values: int
    duplicate_rows: int
    average_text_length: float
    min_text_length: int
    max_text_length: int
    class_distribution: Dict[str, int]
    class_percentages: Dict[str, float]
    health_score: int
    quality_grade: str  # Excellent, Good, Needs Attention, Poor
    warnings: List[str]
    recommendations: List[str]
    score_breakdown: Dict[str, float]


class SplitRequest(BaseModel):
    examples: List[DatasetExample]
    train_ratio: float = 0.70
    val_ratio: float = 0.15
    test_ratio: float = 0.15
    random_seed: int = 42


class SplitResponse(BaseModel):
    train_count: int
    val_count: int
    test_count: int
    train_examples: List[DatasetExample]
    val_examples: List[DatasetExample]
    test_examples: List[DatasetExample]
    is_stratified: bool
    data_leakage_detected: bool


class EvaluationConfig(BaseModel):
    target_macro_f1: float = 0.85
    max_cost_per_1k: float = 1.00
    max_latency_seconds: float = 2.0
    min_f1_improvement: float = 0.05
    hypothesis: str = "Fine-tuning will improve Macro F1 by at least 5 percentage points."


class MetricResults(BaseModel):
    accuracy: float
    precision: float
    recall: float
    macro_f1: float
    per_class_f1: Dict[str, float]
    per_class_precision: Dict[str, float]
    per_class_recall: Dict[str, float]
    per_class_support: Dict[str, int]
    confusion_matrix_labels: List[str]
    confusion_matrix: List[List[int]]
    normalized_confusion_matrix: List[List[float]]
    latency_p50: float
    latency_p95: float
    avg_latency: float
    cost_per_1k: float


class ErrorDetail(BaseModel):
    example_id: int
    input_text: str
    actual_label: str
    predicted_label: str
    confidence: Optional[float] = None
    error_category: str
    explanation: str


class ErrorAnalysisResponse(BaseModel):
    total_errors: int
    error_rate: float
    top_confusions: List[Dict[str, Any]]
    category_counts: Dict[str, int]
    category_percentages: Dict[str, float]
    detailed_errors: List[ErrorDetail]
    dataset_action_items: List[str]


class CostEstimateRequest(BaseModel):
    num_training_examples: int = 150
    avg_tokens_per_example: int = 150
    num_epochs: int = 3
    monthly_prediction_volume: int = 50000
    baseline_model: str = "gpt-4o-mini"
    finetuned_base_model: str = "gpt-4o-mini"


class CostEstimateResponse(BaseModel):
    training_cost: float
    baseline_cost_per_1k: float
    finetuned_cost_per_1k: float
    baseline_monthly_cost: float
    finetuned_monthly_cost: float
    monthly_cost_delta: float
    cost_ratio: float
    pricing_assumptions: Dict[str, float]


class ProductDecisionRequest(BaseModel):
    baseline_metrics: MetricResults
    finetuned_metrics: MetricResults
    config: EvaluationConfig
    cost_metrics: CostEstimateResponse


class ProductDecisionResponse(BaseModel):
    decision: str  # RECOMMENDED, CONSIDER, NOT_RECOMMENDED
    badge_variant: str  # success, warning, destructive
    headline: str
    reasons: List[str]
    risks: List[str]
    next_step: str
    macro_f1_delta: float
    macro_f1_relative_delta: float
    accuracy_delta: float
    passes_target_f1: bool
    passes_min_improvement: bool
    passes_cost_guardrail: bool
    passes_latency_guardrail: bool


class RolloutPhase(BaseModel):
    phase: int
    traffic_percentage: int
    duration_days: int
    key_objective: str
    success_gate: str


class RolloutPlan(BaseModel):
    phases: List[RolloutPhase]
    rollback_triggers: List[str]
    monitoring_metrics: List[str]
    owner: str
    review_cadence: str


class ExperimentRunRequest(BaseModel):
    experiment_name: str = "Customer Support Ticket Classification"
    use_demo_mode: bool = True
    openai_api_key: Optional[str] = None
    baseline_model: str = "gpt-4o-mini"
    finetuned_model_name: str = "ft:gpt-4o-mini:tunelab:support-v1"
    examples: List[DatasetExample]
    config: EvaluationConfig = Field(default_factory=EvaluationConfig)
    cost_request: CostEstimateRequest = Field(default_factory=CostEstimateRequest)


class ExperimentRunResponse(BaseModel):
    experiment_id: str
    experiment_name: str
    mode: str  # "DEMO MODE" or "LIVE OPENAI"
    dataset_analysis: DatasetAnalysisResponse
    split_info: SplitResponse
    baseline_metrics: MetricResults
    finetuned_metrics: MetricResults
    comparison_deltas: Dict[str, Any]
    error_analysis: ErrorAnalysisResponse
    cost_estimate: CostEstimateResponse
    decision: ProductDecisionResponse
    rollout_plan: RolloutPlan
    ai_insights: str
