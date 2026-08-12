from app.models.schemas import RolloutPlan, RolloutPhase


def generate_rollout_plan() -> RolloutPlan:
    """
    Generates a structured 4-phase production deployment rollout strategy with explicit
    rollback triggers and monitoring metrics.
    """
    phases = [
        RolloutPhase(
            phase=1,
            traffic_percentage=5,
            duration_days=3,
            key_objective="Canary testing & error rate monitoring on live traffic shadow.",
            success_gate="0 unhandled 5xx exceptions, latency p95 < 1.8s."
        ),
        RolloutPhase(
            phase=2,
            traffic_percentage=25,
            duration_days=5,
            key_objective="Validate routing accuracy and user feedback signals under moderate load.",
            success_gate="Ticket auto-routing accuracy >= 88%, human reassignment rate < 5%."
        ),
        RolloutPhase(
            phase=3,
            traffic_percentage=50,
            duration_days=7,
            key_objective="Cost/throughput stress test and edge case verification.",
            success_gate="Monthly cost variance within 5% of projection, Macro F1 >= 0.85."
        ),
        RolloutPhase(
            phase=4,
            traffic_percentage=100,
            duration_days=14,
            key_objective="Full primary deployment & legacy baseline model deprecation.",
            success_gate="Stable production deployment with automated daily regression testing."
        )
    ]

    rollback_triggers = [
        "Macro F1 drops below 0.82 for 2 consecutive evaluation windows (24h).",
        "P95 prediction latency exceeds 2.5 seconds.",
        "System error rate / failure rate exceeds 1.5% of total request volume.",
        "Unclassified ticket fallback rate spikes above 8%."
    ]

    monitoring_metrics = [
        "Real-time Macro F1 & per-class precision",
        "P50 / P95 / P99 prediction latency",
        "API cost per 1,000 predictions",
        "Human support agent re-routing override frequency"
    ]

    return RolloutPlan(
        phases=phases,
        rollback_triggers=rollback_triggers,
        monitoring_metrics=monitoring_metrics,
        owner="AI Product Lead & Lead ML Engineer",
        review_cadence="Daily during phases 1-2, weekly post-100% rollout"
    )
