import os
import pandas as pd
from typing import List
from app.models.schemas import DatasetExample

DEFAULT_CSV_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "demo_support_tickets.csv")
)


def load_demo_dataset(csv_path: str = DEFAULT_CSV_PATH) -> List[DatasetExample]:
    """
    Loads the default synthetic 220 customer support ticket dataset.
    """
    if not os.path.exists(csv_path):
        # Fallback if path is different
        alt_path = os.path.join(os.getcwd(), "data", "demo_support_tickets.csv")
        if os.path.exists(alt_path):
            csv_path = alt_path

    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        return [DatasetExample(**row) for row in df.to_dict(orient="records")]
    else:
        # Emergency synthetic fallback
        labels = ["billing", "authentication", "technical_issue", "cancellation", "feature_request", "other"]
        examples = []
        for i in range(1, 151):
            lbl = labels[i % len(labels)]
            examples.append(
                DatasetExample(
                    id=i,
                    input_text=f"Customer request sample #{i} regarding {lbl} issue.",
                    label=lbl
                )
            )
        return examples
