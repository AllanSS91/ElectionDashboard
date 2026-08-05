"""
Election Dashboard 2026
ETL - Validator

Versão: 1.2.0
"""

import pandas as pd


REQUIRED_COLUMNS = [
    "data",
    "instituto",
    "candidato",
    "partido",
    "uf",
    "regiao",
    "turno",
    "intencao_voto",
    "entrevistados",
    "margem_erro"
]


VALID_UF = {
    "AC","AL","AP","AM","BA","CE","DF","ES","GO",
    "MA","MT","MS","MG","PA","PB","PR","PE","PI",
    "RJ","RN","RS","RO","RR","SC","SP","SE","TO"
}


VALID_REGIONS = {
    "Norte",
    "Nordeste",
    "Centro-Oeste",
    "Sudeste",
    "Sul"
}


def validate_columns(df: pd.DataFrame):

    missing = []

    for column in REQUIRED_COLUMNS:
        if column not in df.columns:
            missing.append(column)

    if missing:
        raise ValueError(
            f"Colunas obrigatórias ausentes: {', '.join(missing)}"
        )


def validate_uf(df: pd.DataFrame):

    invalid = df.loc[
        ~df["uf"].isin(VALID_UF),
        "uf"
    ].unique()

    if len(invalid):
        raise ValueError(
            f"UF inválida encontrada: {', '.join(map(str, invalid))}"
        )


def validate_region(df: pd.DataFrame):

    invalid = df.loc[
        ~df["regiao"].isin(VALID_REGIONS),
        "regiao"
    ].unique()

    if len(invalid):
        raise ValueError(
            f"Região inválida encontrada: {', '.join(map(str, invalid))}"
        )


def validate_vote(df: pd.DataFrame):

    invalid = df[
        (df["intencao_voto"] < 0)
        | (df["intencao_voto"] > 100)
    ]

    if not invalid.empty:
        raise ValueError(
            "Existem percentuais de intenção de voto fora do intervalo 0-100."
        )


def validate(df: pd.DataFrame):

    validate_columns(df)
    validate_uf(df)
    validate_region(df)
    validate_vote(df)

    return True