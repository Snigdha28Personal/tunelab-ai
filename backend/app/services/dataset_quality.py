import numpy as np
from typing import Dict, List, Any


def calculate_dataset_quality_score(
    total_examples: int,
    num_classes: int,
    missing_values: int,
    duplicate_rows: int,
    class_distribution: Dict[str, int],
    text_lengths: List[int],
) -> Dict[str, Any]:
    """
    Computes a programmatic dataset health score (0-100) based on 5 weighted metrics:
    - 30% Completeness (ratio of non-missing values)
    - 20% Class Balance (entropy/normalized index of class balance)
    - 20% Duplicate Rate (percentage of unique rows)
    - 15% Label Consistency (minimum examples per class threshold)
    - 15% Text Quality (sufficient length, low extreme outliers)
    """
    warnings: List[str] = []
    recommendations: List[str] = []

    if total_examples == 0:
        return {
            "health_score": 0,
            "quality_grade": "Poor",
            "warnings": ["Dataset is empty."],
            "recommendations": ["Upload a dataset with valid examples."],
            "score_breakdown": {
                "completeness": 0.0,
                "class_balance": 0.0,
                "duplicate_rate": 0.0,
                "label_consistency": 0.0,
                "text_quality": 0.0,
            },
        }

    # 1. Completeness Score (30%)
    valid_ratio = max(0.0, 1.0 - (missing_values / total_examples))
    completeness_score = valid_ratio * 30.0
    if missing_values > 0:
        warnings.append(f"Detected {missing_values} missing or empty text/label entries.")
        recommendations.append("Filter or impute rows with empty text or missing labels.")

    # 2. Class Balance Score (20%)
    if num_classes > 1 and total_examples > 0:
        counts = list(class_distribution.values())
        ideal_count = total_examples / num_classes
        # Normalized Gini or standard deviation relative to ideal
        max_pct = max(counts) / total_examples
        min_pct = min(counts) / total_examples
        
        # Entropy ratio
        probs = [c / total_examples for c in counts if c > 0]
        entropy = -sum(p * np.log2(p) for p in probs)
        max_entropy = np.log2(num_classes) if num_classes > 1 else 1.0
        balance_ratio = entropy / max_entropy if max_entropy > 0 else 1.0
        class_balance_score = balance_ratio * 20.0

        if max_pct > 0.35:
            most_frequent_class = max(class_distribution, key=class_distribution.get)
            warnings.append(
                f"Class imbalance detected: '{most_frequent_class}' accounts for {int(max_pct * 100)}% of dataset."
            )
            recommendations.append("Collect more data for underrepresented classes to improve fine-tuning accuracy.")
    else:
        class_balance_score = 10.0 if num_classes == 1 else 0.0
        warnings.append("Dataset has only 1 class. Classification requires at least 2 classes.")
        recommendations.append("Add examples for at least one additional category.")

    # 3. Duplicate Rate Score (20%)
    dup_ratio = duplicate_rows / total_examples
    unique_ratio = max(0.0, 1.0 - dup_ratio)
    duplicate_score = unique_ratio * 20.0
    if duplicate_rows > 0:
        warnings.append(f"Found {duplicate_rows} duplicate input text rows ({int(dup_ratio * 100)}%).")
        recommendations.append("Deduplicate text records to prevent data contamination and overfitting.")

    # 4. Label Consistency & Minimum Class Support Score (15%)
    min_class_count = min(class_distribution.values()) if class_distribution else 0
    if min_class_count >= 20:
        consistency_ratio = 1.0
    elif min_class_count >= 10:
        consistency_ratio = 0.8
    elif min_class_count >= 5:
        consistency_ratio = 0.5
    else:
        consistency_ratio = 0.2
        warnings.append(f"Underrepresented class has only {min_class_count} examples (minimum 15-20 recommended).")
        recommendations.append("Ensure every class has at least 15-20 labeled examples for reliable evaluation.")

    label_consistency_score = consistency_ratio * 15.0

    # 5. Text Quality Score (15%)
    if text_lengths:
        too_short = sum(1 for l in text_lengths if l < 10)
        too_long = sum(1 for l in text_lengths if l > 2000)
        outlier_ratio = (too_short + too_long) / total_examples
        text_quality_ratio = max(0.0, 1.0 - outlier_ratio)
        text_quality_score = text_quality_ratio * 15.0

        if too_short > 0:
            warnings.append(f"{too_short} text examples are extremely short (< 10 characters).")
        if too_long > 0:
            warnings.append(f"{too_long} text examples are extremely long (> 2,000 characters).")
    else:
        text_quality_score = 0.0

    # Total Health Score calculation
    total_score = int(
        np.round(
            completeness_score
            + class_balance_score
            + duplicate_score
            + label_consistency_score
            + text_quality_score
        )
    )
    total_score = max(0, min(100, total_score))

    # Grade determination
    if total_score >= 85:
        quality_grade = "Excellent"
    elif total_score >= 70:
        quality_grade = "Good"
    elif total_score >= 50:
        quality_grade = "Needs Attention"
    else:
        quality_grade = "Poor"

    if total_examples < 100:
        warnings.append(f"Small dataset size ({total_examples} examples). Fine-tuning performs best with 150+ items.")
        recommendations.append("Expand dataset size to 150+ labeled records for optimal fine-tuning baseline.")

    return {
        "health_score": total_score,
        "quality_grade": quality_grade,
        "warnings": warnings,
        "recommendations": recommendations,
        "score_breakdown": {
            "completeness": float(np.round(completeness_score, 1)),
            "class_balance": float(np.round(class_balance_score, 1)),
            "duplicate_rate": float(np.round(duplicate_score, 1)),
            "label_consistency": float(np.round(label_consistency_score, 1)),
            "text_quality": float(np.round(text_quality_score, 1)),
        },
    }
