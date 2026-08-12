from abc import ABC, abstractmethod
from typing import Dict, Any, List


class FineTuningProvider(ABC):
    """
    Abstract interface for AI Fine-Tuning Providers.
    """

    @abstractmethod
    def upload_training_file(self, file_content: str) -> str:
        pass

    @abstractmethod
    def create_fine_tuning_job(self, file_id: str, model_name: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_job_status(self, job_id: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def run_inference(self, model_id: str, prompt: str) -> str:
        pass
