import os
from dotenv import load_dotenv
from utils.logger import setup_logger

logger = setup_logger(__name__)

class ConfigLoader:
    """Loads configuration and environment variables."""

    @staticmethod
    def load():
        """Loads environment variables from .env file."""
        logger.info("Loading environment variables...")
        load_dotenv()

        # Verify required keys
        api_keys = {
            "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY"),
            "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
            "CLAUDE_API_KEY": os.getenv("CLAUDE_API_KEY")
        }

        available_keys = [k for k, v in api_keys.items() if v and v != f"your_{k.lower().replace('_api_key', '')}_api_key_here"]

        if available_keys:
            logger.info(f"Loaded APIs: {', '.join(available_keys)}")
        else:
            logger.warning("No valid API keys found in .env. Please configure them.")

        return api_keys
