import pandas as pd
import numpy as np
from typing import List, Dict, Any, Tuple
from app.models.schemas import DatasetExample, DatasetAnalysisResponse
from app.services.dataset_quality import calculate_dataset_quality_score


def analyze_dataset_examples(examples: List[DatasetExample]) -> DatasetAnalysisResponse:
    """
    Parses and analyzes dataset examples using pandas and python computation.
    Computes missing values, duplicates, text length statistics, class distribution,
    and calls programmatic quality score engine.
    """
    if not examples:
        return DatasetAnalysisResponse(
            total_examples=0,
            num_classes=0,
            missing_values=0,
            duplicate_rows=0,
            average_text_length=0.0,
            min_text_length=0,
            max_text_length=0,
            class_distribution={},
            class_percentages={},
            health_score=0,
            quality_grade="Poor",
            warnings=["Dataset is empty."],
            recommendations=["Upload a dataset with at least 50-100 examples per class."],
            score_breakdown={"completeness": 0, "class_balance": 0, "duplicate_rate": 0, "label_consistency": 0, "text_quality": 0}
        )

    # Convert to pandas DataFrame for fast vector computation
    df = pd.DataFrame([e.model_dump() for e in examples])

    total_examples = len(df)
    
    # Missing values check
    missing_text = df["input_text"].isna() | (df["input_text"].str.strip() == "")
    missing_label = df["label"].isna() | (df["label"].str.strip() == "")
    missing_values = int((missing_text | missing_label).sum())

    # Duplicate rows check (exact text duplicates)
    clean_texts = df["input_text"].fillna("").str.strip().str.lower()
    duplicate_rows = int(clean_texts.duplicated().sum())

    # Text length stats
    text_lengths = df["input_text"].fillna("").str.len()
    avg_length = float(np.mean(text_lengths)) if total_examples > 0 else 0.0
    min_length = int(np.min(text_lengths)) if total_examples > 0 else 0
    max_length = int(np.max(text_lengths)) if total_examples > 0 else 0

    # Class distribution
    class_counts_series = df["label"].value_counts()
    class_distribution = {str(k): int(v) for k, v in class_counts_series.items()}
    num_classes = len(class_distribution)
    
    class_percentages = {
        k: float(np.round((v / total_examples) * 100, 2))
        for k, v in class_distribution.items()
    }

    # Calculate dataset quality score programmatically
    quality_result = calculate_dataset_quality_score(
        total_examples=total_examples,
        num_classes=num_classes,
        missing_values=missing_values,
        duplicate_rows=duplicate_rows,
        class_distribution=class_distribution,
        text_lengths=text_lengths.tolist(),
    )

    return DatasetAnalysisResponse(
        total_examples=total_examples,
        num_classes=num_classes,
        missing_values=missing_values,
        duplicate_rows=duplicate_rows,
        average_text_length=float(np.round(avg_length, 1)),
        min_text_length=min_length,
        max_text_length=max_length,
        class_distribution=class_distribution,
        class_percentages=class_percentages,
        health_score=quality_result["health_score"],
        quality_grade=quality_result["quality_grade"],
        warnings=quality_result["warnings"],
        recommendations=quality_result["recommendations"],
        score_breakdown=quality_result["score_breakdown"]
    )
