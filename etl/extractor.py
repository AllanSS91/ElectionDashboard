"""
Election Dashboard 2026
ETL - Extractor

Versão: 1.2.0
"""

import pandas as pd

from config import CSV_FILE


def extract_csv() -> pd.DataFrame:
    """
    Lê o arquivo CSV oficial do projeto.

    Returns
    -------
    pandas.DataFrame
        Dados carregados do CSV.
    """

    if not CSV_FILE.exists():
        raise FileNotFoundError(
            f"Arquivo não encontrado: {CSV_FILE}"
        )

    df = pd.read_csv(
        CSV_FILE,
        encoding="utf-8"
    )

    return df