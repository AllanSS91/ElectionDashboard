"""
Election Dashboard 2026
ETL - Exporter

Versão: 1.2.0
"""

import pandas as pd

from config import CSV_FILE


def export_csv(df: pd.DataFrame) -> None:
    """
    Exporta os dados para o CSV oficial do projeto.
    """

    CSV_FILE.parent.mkdir(parents=True, exist_ok=True)

    df.to_csv(
        CSV_FILE,
        index=False,
        encoding="utf-8",
        sep=","
    )