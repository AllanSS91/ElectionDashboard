"""
Election Dashboard 2026
ETL - Main

Versão: 1.2.0
"""

from config import PROJECT_NAME, VERSION
from logger import get_logger


logger = get_logger()


def main():

    logger.info("=" * 60)
    logger.info(PROJECT_NAME)
    logger.info(f"ETL Version: {VERSION}")
    logger.info("Inicializando ETL...")
    logger.info("ETL executado com sucesso.")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()