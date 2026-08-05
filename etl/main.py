"""
Election Dashboard 2026
ETL - Main

Versão: 1.2.0
"""

import sys

from config import PROJECT_NAME, VERSION
from extractor import extract_csv
from logger import get_logger
from transformer import transform
from validator import validate
from exporter import export_csv

logger = get_logger()


def main() -> int:
    """
    Fluxo principal do ETL.

    Returns
    -------
    int
        0 = sucesso
        1 = erro
    """

    logger.info("=" * 60)
    logger.info(PROJECT_NAME)
    logger.info(f"ETL Version: {VERSION}")

    try:

        logger.info("Lendo CSV...")
        df = extract_csv()

        logger.info("Transformando dados...")
        df = transform(df)

        logger.info(f"{len(df)} registros encontrados.")

        logger.info("Validando dados...")
        validate(df)

        logger.info("Validação concluída com sucesso.")

        logger.info("Exportando CSV...")
        export_csv(df)

        logger.info("Exportação concluída.")
        logger.info("ETL finalizado com sucesso.")

        return 0

    except FileNotFoundError as error:

        logger.error(f"Arquivo não encontrado: {error}")
        return 1

    except ValueError as error:

        logger.error(f"Erro de validação: {error}")
        return 1

    except Exception:

        logger.exception("Erro inesperado durante a execução do ETL.")
        return 1

    finally:

        logger.info("=" * 60)


if __name__ == "__main__":
    sys.exit(main())