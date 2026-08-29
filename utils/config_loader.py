import os
from pathlib import Path
from dotenv import load_dotenv
from utils.logger import setup_logger

logger = setup_logger(__name__)

class ConfigLoader:
    """Loads configuration and environment variables safely."""

    @staticmethod
    def load(dotenv_path=None):
        """Loads environment variables from .env file safely."""
        logger.info("Loading environment variables...")
        if dotenv_path is None:
            repo_root = Path(__file__).resolve().parent.parent
            candidate_paths = [
                repo_root / ".env",
                repo_root / "job-outreach" / ".env",
                repo_root / "web-app" / "server" / ".env"
            ]
            for cp in candidate_paths:
                if cp.exists() and cp.is_file():
                    try:
                        load_dotenv(dotenv_path=str(cp))
                    except Exception as e:
                        logger.warning(f"Could not load {cp}: {e}")
        else:
            try:
                load_dotenv(dotenv_path=str(dotenv_path))
            except Exception as e:
                logger.warning(f"Could not load {dotenv_path}: {e}")

        # Verify required keys
        api_keys = {
            "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY"),
            "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
            "CLAUDE_API_KEY": os.getenv("CLAUDE_API_KEY"),
            "GH_TOKEN": os.getenv("GH_TOKEN") or os.getenv("GITHUB_TOKEN"),
            "GOOGLE_DRIVE_TOKEN": os.getenv("GOOGLE_DRIVE_TOKEN")
        }

        available_keys = [k for k, v in api_keys.items() if v and not str(v).startswith("your_")]

        if available_keys:
            logger.info(f"Loaded APIs: {', '.join(available_keys)}")
        else:
            logger.warning("No valid API keys found in .env. Please configure them.")

        return api_keys
