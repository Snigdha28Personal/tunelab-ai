import os
import io
from typing import Dict, Any
from app.finetuning.provider import FineTuningProvider

try:
    from openai import OpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False


class OpenAIFineTuningProvider(FineTuningProvider):
    """
    OpenAI API Fine-Tuning Provider Implementation.
    Isolated server-side execution. API keys are never exposed to browser.
    """

    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if HAS_OPENAI and self.api_key:
            self.client = OpenAI(api_key=self.api_key)
        else:
            self.client = None

    def is_available(self) -> bool:
        return self.client is not None

    def upload_training_file(self, file_content: str) -> str:
        if not self.is_available():
            raise RuntimeError("OpenAI API key is missing or invalid.")
        
        file_obj = io.BytesIO(file_content.encode("utf-8"))
        file_obj.name = "training_data.jsonl"
        
        response = self.client.files.create(
            file=file_obj,
            purpose="fine-tune"
        )
        return response.id

    def create_fine_tuning_job(self, file_id: str, model_name: str = "gpt-4o-mini-2024-07-18") -> Dict[str, Any]:
        if not self.is_available():
            raise RuntimeError("OpenAI API key is missing or invalid.")

        job = self.client.fine_tuning.jobs.create(
            training_file=file_id,
            model=model_name
        )
        return {
            "job_id": job.id,
            "status": job.status,
            "created_at": job.created_at,
            "model": job.model
        }

    def get_job_status(self, job_id: str) -> Dict[str, Any]:
        if not self.is_available():
            raise RuntimeError("OpenAI API key is missing or invalid.")

        job = self.client.fine_tuning.jobs.retrieve(job_id)
        return {
            "job_id": job.id,
            "status": job.status,
            "fine_tuned_model": job.fine_tuned_model,
            "finished_at": job.finished_at
        }

    def run_inference(self, model_id: str, prompt: str) -> str:
        if not self.is_available():
            raise RuntimeError("OpenAI API key is missing or invalid.")

        response = self.client.chat.completions.create(
            model=model_id,
            messages=[
                {"role": "system", "content": "Categorize customer inquiry into: billing, authentication, technical_issue, cancellation, feature_request, or other. Output label only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0,
            max_tokens=15
        )
        return response.choices[0].message.content.strip()
