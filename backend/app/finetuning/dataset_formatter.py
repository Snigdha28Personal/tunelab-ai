import json
from typing import List, Dict, Any
from app.models.schemas import DatasetExample

SYSTEM_PROMPT = "You are a customer support triage classifier. Categorize the user inquiry into exactly one of the following classes: billing, authentication, technical_issue, cancellation, feature_request, or other. Output only the label."


def format_openai_jsonl(examples: List[DatasetExample]) -> tuple[List[Dict[str, Any]], str, int, List[str]]:
    """
    Formats dataset examples into OpenAI Fine-Tuning Chat JSONL structure:
    {"messages": [{"role": "system", ...}, {"role": "user", ...}, {"role": "assistant", ...}]}
    
    Returns:
    (formatted_records, jsonl_string, estimated_token_count, validation_errors)
    """
    formatted_records = []
    validation_errors = []
    total_tokens = 0

    for i, ex in enumerate(examples):
        if not ex.input_text or not ex.input_text.strip():
            validation_errors.append(f"Row #{i+1} (ID {ex.id}) has empty input text.")
            continue
        
        if not ex.label or not ex.label.strip():
            validation_errors.append(f"Row #{i+1} (ID {ex.id}) has empty label.")
            continue

        record = {
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": ex.input_text.strip()},
                {"role": "assistant", "content": ex.label.strip()}
            ]
        }
        formatted_records.append(record)

        # Token estimation: approx 1 token per 4 chars
        full_text = SYSTEM_PROMPT + ex.input_text + ex.label
        total_tokens += max(10, len(full_text) // 4)

    # Convert to JSONL string lines
    jsonl_lines = [json.dumps(r) for r in formatted_records]
    jsonl_string = "\n".join(jsonl_lines)

    return formatted_records, jsonl_string, total_tokens, validation_errors
