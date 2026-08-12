import io
import pandas as pd
import json
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from app.models.schemas import (
    DatasetAnalysisRequest,
    DatasetAnalysisResponse,
    DatasetExample,
    SplitRequest,
    SplitResponse
)
from app.services.dataset_processor import analyze_dataset_examples
from app.services.splitter import split_dataset
from app.demo.demo_dataset import load_demo_dataset
from app.finetuning.dataset_formatter import format_openai_jsonl

router = APIRouter(prefix="/api/datasets", tags=["datasets"])


@router.get("/demo", response_model=List[DatasetExample])
def get_demo_dataset():
    """
    Returns the synthetic 220 customer support ticket dataset.
    """
    return load_demo_dataset()


@router.post("/analyze", response_model=DatasetAnalysisResponse)
def analyze_dataset(request: DatasetAnalysisRequest):
    """
    Analyzes uploaded dataset examples using Python pandas & quality scoring engine.
    """
    return analyze_dataset_examples(request.examples)


@router.post("/upload", response_model=List[DatasetExample])
async def upload_dataset_file(file: UploadFile = File(...)):
    """
    Parses CSV or JSONL file upload into structured DatasetExamples.
    """
    filename = file.filename.lower()
    content = await file.read()

    examples = []
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
            # Column mapping heuristics
            text_col = "input_text" if "input_text" in df.columns else ("text" if "text" in df.columns else df.columns[0])
            label_col = "label" if "label" in df.columns else ("category" if "category" in df.columns else df.columns[-1])

            for idx, row in df.iterrows():
                examples.append(
                    DatasetExample(
                        id=idx + 1,
                        input_text=str(row[text_col]),
                        label=str(row[label_col])
                    )
                )
        elif filename.endswith(".jsonl"):
            lines = content.decode("utf-8").splitlines()
            for idx, line in enumerate(lines):
                if not line.strip():
                    continue
                data = json.loads(line)
                text = data.get("input_text") or data.get("text") or ""
                lbl = data.get("label") or data.get("category") or ""
                examples.append(DatasetExample(id=idx + 1, input_text=str(text), label=str(lbl)))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a .csv or .jsonl file.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse dataset file: {str(e)}")

    return examples


@router.post("/split", response_model=SplitResponse)
def split_dataset_endpoint(request: SplitRequest):
    """
    Splits dataset into Train / Val / Test sets using scikit-learn.
    """
    return split_dataset(request)


@router.post("/format-finetuning")
def format_finetuning_endpoint(examples: List[DatasetExample]):
    """
    Formats dataset into OpenAI JSONL structure and estimates tokens.
    """
    formatted, jsonl_str, tokens, errors = format_openai_jsonl(examples)
    return {
        "num_examples": len(formatted),
        "estimated_tokens": tokens,
        "validation_errors": errors,
        "jsonl_snippet": jsonl_str[:500] if jsonl_str else ""
    }
