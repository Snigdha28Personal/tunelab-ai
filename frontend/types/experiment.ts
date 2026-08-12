export interface DatasetExample {
  id: number;
  input_text: string;
  label: string;
}

export interface DatasetAnalysisResponse {
  total_examples: number;
  num_classes: number;
  missing_values: number;
  duplicate_rows: number;
  average_text_length: number;
  min_text_length: number;
  max_text_length: number;
  class_distribution: Record<string, number>;
  class_percentages: Record<string, number>;
  health_score: number;
  quality_grade: string;
  warnings: string[];
  recommendations: string[];
  score_breakdown: {
    completeness: number;
    class_balance: number;
    duplicate_rate: number;
    label_consistency: number;
    text_quality: number;
  };
}

export interface SplitResponse {
  train_count: number;
  val_count: number;
  test_count: number;
  train_examples: DatasetExample[];
  val_examples: DatasetExample[];
  test_examples: DatasetExample[];
  is_stratified: boolean;
  data_leakage_detected: boolean;
}

export interface EvaluationConfig {
  target_macro_f1: number;
  max_cost_per_1k: number;
  max_latency_seconds: number;
  min_f1_improvement: number;
  hypothesis: string;
}

export interface MetricResults {
  accuracy: number;
  precision: number;
  recall: number;
  macro_f1: number;
  per_class_f1: Record<string, number>;
  per_class_precision: Record<string, number>;
  per_class_recall: Record<string, number>;
  per_class_support: Record<string, number>;
  confusion_matrix_labels: string[];
  confusion_matrix: number[][];
  normalized_confusion_matrix: number[][];
  latency_p50: number;
  latency_p95: number;
  avg_latency: number;
  cost_per_1k: number;
}

export interface ErrorDetail {
  example_id: number;
  input_text: string;
  actual_label: string;
  predicted_label: string;
  confidence?: number;
  error_category: string;
  explanation: string;
}

export interface ErrorAnalysisResponse {
  total_errors: number;
  error_rate: number;
  top_confusions: {
    pair: string;
    actual: string;
    predicted: string;
    count: number;
    pct_of_errors: number;
  }[];
  category_counts: Record<string, number>;
  category_percentages: Record<string, number>;
  detailed_errors: ErrorDetail[];
  dataset_action_items: string[];
}

export interface CostEstimateResponse {
  training_cost: number;
  baseline_cost_per_1k: number;
  finetuned_cost_per_1k: number;
  baseline_monthly_cost: number;
  finetuned_monthly_cost: number;
  monthly_cost_delta: number;
  cost_ratio: number;
  pricing_assumptions: Record<string, number>;
}

export interface ProductDecisionResponse {
  decision: "RECOMMENDED" | "CONSIDER" | "NOT_RECOMMENDED";
  badge_variant: "success" | "warning" | "destructive";
  headline: string;
  reasons: string[];
  risks: string[];
  next_step: string;
  macro_f1_delta: number;
  macro_f1_relative_delta: number;
  accuracy_delta: number;
  passes_target_f1: boolean;
  passes_min_improvement: boolean;
  passes_cost_guardrail: boolean;
  passes_latency_guardrail: boolean;
}

export interface RolloutPhase {
  phase: number;
  traffic_percentage: number;
  duration_days: number;
  key_objective: string;
  success_gate: string;
}

export interface RolloutPlan {
  phases: RolloutPhase[];
  rollback_triggers: string[];
  monitoring_metrics: string[];
  owner: string;
  review_cadence: string;
}

export interface ExperimentRunResponse {
  experiment_id: string;
  experiment_name: string;
  mode: string;
  dataset_analysis: DatasetAnalysisResponse;
  split_info: SplitResponse;
  baseline_metrics: MetricResults;
  finetuned_metrics: MetricResults;
  comparison_deltas: Record<string, any>;
  error_analysis: ErrorAnalysisResponse;
  cost_estimate: CostEstimateResponse;
  decision: ProductDecisionResponse;
  rollout_plan: RolloutPlan;
  ai_insights: string;
}
