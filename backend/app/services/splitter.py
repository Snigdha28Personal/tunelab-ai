import pandas as pd
from typing import List
from sklearn.model_selection import train_test_split
from app.models.schemas import DatasetExample, SplitRequest, SplitResponse


def split_dataset(request: SplitRequest) -> SplitResponse:
    """
    Splits dataset into Train / Validation / Test sets using scikit-learn.
    Attempts stratified sampling based on labels. Prevents data leakage.
    """
    examples = request.examples
    if not examples:
        return SplitResponse(
            train_count=0,
            val_count=0,
            test_count=0,
            train_examples=[],
            val_examples=[],
            test_examples=[],
            is_stratified=False,
            data_leakage_detected=False
        )

    df = pd.DataFrame([e.model_dump() for e in examples])

    labels = df["label"].tolist()
    
    # Check if stratification is possible (every class must have >= 2 examples)
    class_counts = df["label"].value_counts()
    can_stratify = all(c >= 2 for c in class_counts.values) and len(class_counts) > 1

    stratify_col = df["label"] if can_stratify else None

    # Step 1: Split into Train vs Temp (Val + Test)
    temp_ratio = request.val_ratio + request.test_ratio
    
    try:
        train_df, temp_df = train_test_split(
            df,
            test_size=temp_ratio,
            random_state=request.random_seed,
            stratify=stratify_col
        )
    except Exception:
        # Fallback to non-stratified split if stratification fails due to edge cases
        train_df, temp_df = train_test_split(
            df,
            test_size=temp_ratio,
            random_state=request.random_seed,
            stratify=None
        )
        can_stratify = False

    # Step 2: Split Temp into Validation and Test
    val_share_of_temp = request.val_ratio / temp_ratio if temp_ratio > 0 else 0.5
    
    temp_stratify = temp_df["label"] if (can_stratify and all(c >= 2 for c in temp_df["label"].value_counts().values)) else None

    try:
        val_df, test_df = train_test_split(
            temp_df,
            test_size=(1.0 - val_share_of_temp),
            random_state=request.random_seed,
            stratify=temp_stratify
        )
    except Exception:
        val_df, test_df = train_test_split(
            temp_df,
            test_size=(1.0 - val_share_of_temp),
            random_state=request.random_seed,
            stratify=None
        )

    # Convert back to DatasetExample lists
    train_examples = [DatasetExample(**row) for row in train_df.to_dict(orient="records")]
    val_examples = [DatasetExample(**row) for row in val_df.to_dict(orient="records")]
    test_examples = [DatasetExample(**row) for row in test_df.to_dict(orient="records")]

    # Data leakage check (check ID intersection)
    train_ids = set(train_df["id"])
    val_ids = set(val_df["id"])
    test_ids = set(test_df["id"])

    has_leakage = bool(
        len(train_ids.intersection(val_ids)) > 0
        or len(train_ids.intersection(test_ids)) > 0
        or len(val_ids.intersection(test_ids)) > 0
    )

    return SplitResponse(
        train_count=len(train_examples),
        val_count=len(val_examples),
        test_count=len(test_examples),
        train_examples=train_examples,
        val_examples=val_examples,
        test_examples=test_examples,
        is_stratified=can_stratify,
        data_leakage_detected=has_leakage
    )
