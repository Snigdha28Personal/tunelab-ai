from app.models.schemas import (
    MetricResults,
    EvaluationConfig,
    CostEstimateResponse,
    ProductDecisionResponse
)


def decide_finetuning_strategy(
    baseline_metrics: MetricResults,
    finetuned_metrics: MetricResults,
    config: EvaluationConfig,
    cost_metrics: CostEstimateResponse
) -> ProductDecisionResponse:
    """
    Programmatically evaluates model experiment results against business success criteria
    and product guardrails to render a structured deployment decision.
    """
    f1_delta = finetuned_metrics.macro_f1 - baseline_metrics.macro_f1
    f1_relative_delta = (
        (f1_delta / baseline_metrics.macro_f1 * 100.0)
        if baseline_metrics.macro_f1 > 0
        else 0.0
    )
    acc_delta = finetuned_metrics.accuracy - baseline_metrics.accuracy

    # Criteria evaluations
    passes_target_f1 = bool(finetuned_metrics.macro_f1 >= config.target_macro_f1)
    passes_min_improvement = bool(f1_delta >= config.min_f1_improvement)
    passes_cost_guardrail = bool(finetuned_metrics.cost_per_1k <= config.max_cost_per_1k)
    passes_latency_guardrail = bool(finetuned_metrics.avg_latency <= config.max_latency_seconds)

    reasons = []
    risks = []

    if passes_target_f1:
        reasons.append(
            f"Fine-tuned Macro F1 ({finetuned_metrics.macro_f1 * 100:.1f}%) meets or exceeds the target threshold of {config.target_macro_f1 * 100:.1f}%."
        )
    else:
        risks.append(
            f"Fine-tuned Macro F1 ({finetuned_metrics.macro_f1 * 100:.1f}%) fell short of target ({config.target_macro_f1 * 100:.1f}%)."
        )

    if passes_min_improvement:
        reasons.append(
            f"Quality improvement (+{f1_delta * 100:.1f} percentage points) exceeds the minimum required delta of +{config.min_f1_improvement * 100:.1f} pts."
        )
    else:
        risks.append(
            f"Improvement (+{f1_delta * 100:.1f} pts) did not justify additional complexity (required +{config.min_f1_improvement * 100:.1f} pts)."
        )

    if passes_cost_guardrail:
        reasons.append(
            f"Inference cost (${finetuned_metrics.cost_per_1k:.2f}/1K) remains safely below budget guardrail (${config.max_cost_per_1k:.2f}/1K)."
        )
    else:
        risks.append(
            f"Inference cost (${finetuned_metrics.cost_per_1k:.2f}/1K) exceeded budget cap (${config.max_cost_per_1k:.2f}/1K)."
        )

    if passes_latency_guardrail:
        reasons.append(
            f"Average latency ({finetuned_metrics.avg_latency:.2f}s) satisfies SLA limit ({config.max_latency_seconds:.2f}s)."
        )
    else:
        risks.append(
            f"Average latency ({finetuned_metrics.avg_latency:.2f}s) breached SLA guardrail ({config.max_latency_seconds:.2f}s)."
        )

    # Decision Matrix
    if (
        passes_target_f1
        and passes_min_improvement
        and passes_cost_guardrail
        and passes_latency_guardrail
    ):
        decision = "RECOMMENDED"
        badge_variant = "success"
        headline = "Proceed to Controlled Production Rollout"
        next_step = "Deploy fine-tuned model to 5% of production traffic with real-time automated fallback."
    elif passes_target_f1 and (passes_min_improvement or passes_cost_guardrail):
        decision = "CONSIDER"
        badge_variant = "warning"
        headline = "Conditional Approval — Optimize Cost/Latency Before Full Deployment"
        next_step = "Run 1-week shadow evaluation or perform prompt compression to reduce inference costs."
    else:
        decision = "NOT_RECOMMENDED"
        badge_variant = "destructive"
        headline = "Do Not Fine-Tune — Baseline or Prompt Engineering Retains Higher ROI"
        next_step = "Iterate on baseline prompt templates or expand dataset quality before re-evaluating fine-tuning."

    return ProductDecisionResponse(
        decision=decision,
        badge_variant=badge_variant,
        headline=headline,
        reasons=reasons,
        risks=risks,
        next_step=next_step,
        macro_f1_delta=round(f1_delta, 4),
        macro_f1_relative_delta=round(f1_relative_delta, 2),
        accuracy_delta=round(acc_delta, 4),
        passes_target_f1=passes_target_f1,
        passes_min_improvement=passes_min_improvement,
        passes_cost_guardrail=passes_cost_guardrail,
        passes_latency_guardrail=passes_latency_guardrail,
    )
