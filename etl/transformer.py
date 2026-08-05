"""
Election Dashboard 2026
ETL - Transformer

Versão: 1.2.0
"""

import pandas as pd



def transform(df: pd.DataFrame) -> pd.DataFrame:
    """
    Padroniza os dados para o formato oficial do projeto.
    """

    df = df.copy()

    # Remove espaços em branco dos nomes das colunas
    df.columns = df.columns.str.strip()

    # Remove espaços em branco dos textos
    text_columns = [
        "instituto",
        "candidato",
        "partido",
        "uf",
        "regiao"
    ]

    for column in text_columns:
        if column in df.columns:
            df[column] = (
                df[column]
                .astype(str)
                .str.strip()
            )

    # Padroniza UF
    if "uf" in df.columns:
        df["uf"] = df["uf"].str.upper()

    # Padroniza Região
    if "regiao" in df.columns:
        df["regiao"] = df["regiao"].replace({
            "centro oeste": "Centro-Oeste",
            "Centro Oeste": "Centro-Oeste",
            "CENTRO-OESTE": "Centro-Oeste",
            "SUDESTE": "Sudeste",
            "SUL": "Sul",
            "NORTE": "Norte",
            "NORDESTE": "Nordeste"
        })

    # Conversões numéricas
    numeric_columns = [
        "turno",
        "intencao_voto",
        "entrevistados",
        "margem_erro"
    ]

    for column in numeric_columns:
        if column in df.columns:
            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )

    # Data
    if "data" in df.columns:
        df["data"] = pd.to_datetime(
            df["data"],
            errors="coerce"
        ).dt.strftime("%Y-%m-%d")

    return df