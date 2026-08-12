import pytest
from app.models.schemas import ExperimentRunRequest
from app.demo.demo_dataset import load_demo_dataset
from app.services.experiment_runner import run_experiment


def test_run_demo_experiment():
    examples = load_demo_dataset()
    req = ExperimentRunRequest(
        experiment_name="Customer Support Ticket Classification Demo",
        use_demo_mode=True,
        examples=examples
    )

    res = run_experiment(req)
    assert res.experiment_id.startswith("exp-")
    assert res.mode == "DEMO MODE (Python Engine)"
    assert res.baseline_metrics.macro_f1 > 0
    assert res.finetuned_metrics.macro_f1 > res.baseline_metrics.macro_f1
    assert res.decision.decision in ["RECOMMENDED", "CONSIDER", "NOT_RECOMMENDED"]
    assert len(res.rollout_plan.phases) == 4
    assert len(res.ai_insights) > 20
