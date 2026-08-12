import pytest
from app.models.schemas import DatasetExample, SplitRequest
from app.services.splitter import split_dataset


def create_sample_dataset(count=100):
    labels = ["billing", "authentication", "cancellation", "technical_issue"]
    examples = []
    for i in range(1, count + 1):
        lbl = labels[i % len(labels)]
        examples.append(DatasetExample(id=i, input_text=f"Sample input text #{i}", label=lbl))
    return examples


def test_split_proportions_and_leakage():
    examples = create_sample_dataset(100)
    req = SplitRequest(examples=examples, train_ratio=0.70, val_ratio=0.15, test_ratio=0.15, random_seed=42)
    res = split_dataset(req)

    assert res.train_count == 70
    assert res.val_count == 15
    assert res.test_count == 15
    assert res.data_leakage_detected is False

    # Check ID set intersections
    train_ids = {e.id for e in res.train_examples}
    val_ids = {e.id for e in res.val_examples}
    test_ids = {e.id for e in res.test_examples}

    assert len(train_ids.intersection(val_ids)) == 0
    assert len(train_ids.intersection(test_ids)) == 0
    assert len(val_ids.intersection(test_ids)) == 0


def test_split_determinism():
    examples = create_sample_dataset(100)
    req1 = SplitRequest(examples=examples, random_seed=42)
    res1 = split_dataset(req1)

    req2 = SplitRequest(examples=examples, random_seed=42)
    res2 = split_dataset(req2)

    assert [e.id for e in res1.train_examples] == [e.id for e in res2.train_examples]

    req3 = SplitRequest(examples=examples, random_seed=99)
    res3 = split_dataset(req3)

    assert [e.id for e in res1.train_examples] != [e.id for e in res3.train_examples]
