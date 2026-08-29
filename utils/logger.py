import logging
import os
from datetime import datetime

def setup_logger(name: str) -> logging.Logger:
    """Sets up a standardized logger for the project."""
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    # File handler
    try:
        if not os.path.exists('logs'):
            os.makedirs('logs', exist_ok=True)
        log_file = f"logs/app_{datetime.now().strftime('%Y-%m-%d')}.log"
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(formatter)
    except (OSError, PermissionError):
        file_handler = None

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(formatter)

    # Add handlers to logger
    if not logger.handlers:
        if file_handler:
            logger.addHandler(file_handler)
        logger.addHandler(console_handler)

    return logger
