import numpy as np
import random
from typing import List, Tuple
from app.models.schemas import DatasetExample


def generate_demo_predictions(
    test_examples: List[DatasetExample],
    seed: int = 42
) -> Tuple[List[str], List[float], List[str], List[float]]:
    """
    Generates deterministic simulated prediction outputs for both Baseline and Fine-tuned models.
    
    Returns:
    (baseline_preds, baseline_latencies, finetuned_preds, finetuned_latencies)
    
    Baseline Accuracy Target: ~79-82%
    Fine-Tuned Accuracy Target: ~89-92%
    """
    rng = random.Random(seed)

    baseline_preds: List[str] = []
    baseline_latencies: List[float] = []

    finetuned_preds: List[str] = []
    finetuned_latencies: List[float] = []

    # Common confuse maps for realistic baseline failures
    confusion_map = {
        "billing": ["cancellation", "other"],
        "cancellation": ["billing"],
        "technical_issue": ["feature_request"],
        "feature_request": ["technical_issue"],
        "authentication": ["technical_issue"],
        "other": ["billing", "feature_request"]
    }

    for ex in test_examples:
        actual = ex.label
        text = ex.input_text.lower()
        
        # 1. Baseline Model Simulation (80% accuracy)
        # Deterministic hash of example id + seed
        r1 = (ex.id * 17 + seed) % 100
        if r1 < 79:  # Correct prediction
            b_pred = actual
        else:  # Error
            options = confusion_map.get(actual, ["other"])
            b_pred = options[ex.id % len(options)]

        b_lat = round(rng.uniform(0.9, 1.4), 2)
        baseline_preds.append(b_pred)
        baseline_latencies.append(b_lat)

        # 2. Fine-Tuned Model Simulation (91% accuracy)
        r2 = (ex.id * 31 + seed) % 100
        if r2 < 91:  # Correct prediction
            ft_pred = actual
        else:  # Error (fewer edge case errors)
            options = confusion_map.get(actual, ["other"])
            ft_pred = options[(ex.id + 1) % len(options)]

        ft_lat = round(rng.uniform(1.1, 1.5), 2)
        finetuned_preds.append(ft_pred)
        finetuned_latencies.append(ft_lat)

    return baseline_preds, baseline_latencies, finetuned_preds, finetuned_latencies
