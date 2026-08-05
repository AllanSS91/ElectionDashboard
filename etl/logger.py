"""
Election Dashboard 2026
ETL - Logger

Versão: 1.2.0
"""

import logging

from config import LOG_DIR, LOG_FILE


def get_logger():

    # Cria a pasta de logs caso não exista
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    logger = logging.getLogger("ElectionDashboard")

    if logger.handlers:
        return logger

    logger.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(message)s",
        "%Y-%m-%d %H:%M:%S"
    )

    # Arquivo
    file_handler = logging.FileHandler(
        LOG_FILE,
        encoding="utf-8"
    )

    file_handler.setFormatter(formatter)

    # Terminal
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    return logger