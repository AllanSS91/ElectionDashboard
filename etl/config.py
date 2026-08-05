"""
Election Dashboard 2026
ETL Configuration

Versão: 1.2.0
"""

from pathlib import Path

# ==========================================================
# Projeto
# ==========================================================

PROJECT_NAME = "Election Dashboard"
VERSION = "1.2.0"

# ==========================================================
# Diretórios
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data"

LOG_DIR = BASE_DIR / "logs"

TEMP_DIR = BASE_DIR / "temp"

# ==========================================================
# Arquivos
# ==========================================================

CSV_FILE = DATA_DIR / "pesquisas2026.csv"

LOG_FILE = LOG_DIR / "etl.log"

# Backup (implementação futura)

BACKUP_DIR = BASE_DIR / "backup"

# ==========================================================
# URLs
# ==========================================================

# Portal do TSE (será utilizado na v1.3.0)

TSE_BASE_URL = ""

# ==========================================================
# Configurações do ETL
# ==========================================================

CSV_ENCODING = "utf-8"

CSV_SEPARATOR = ","

REQUEST_TIMEOUT = 30

MAX_RETRIES = 3

# ==========================================================
# Ambiente
# ==========================================================

DEBUG = False

ENVIRONMENT = "production"