# 🇧🇷 Election Dashboard 2026

Dashboard interativo para análise de pesquisas eleitorais brasileiras.

O projeto foi desenvolvido utilizando HTML, Bootstrap e JavaScript, com foco em desempenho, organização e atualização automática dos dados através de ETL em Python e GitHub Actions.

---

## Demonstração

> Em desenvolvimento

GitHub Pages

```
https://allanss91.github.io/ElectionDashboard/
```

Repositório

```
https://github.com/AllanSS91/ElectionDashboard
```

---

# Funcionalidades

- Dashboard responsivo
- KPIs automáticos
- Evolução das pesquisas
- Comparação entre candidatos
- Ranking de institutos
- Heatmap por estado
- Mapa interativo do Brasil
- Pesquisa rápida
- Filtros dinâmicos
- Exportação para PNG
- Exportação para PDF
- Exportação para Excel
- Tema claro/escuro

---

# Tecnologias

## Frontend

- HTML5
- CSS3
- Bootstrap 5
- JavaScript ES6

## Bibliotecas

- ApexCharts
- Leaflet
- html2canvas
- jsPDF
- SheetJS

## Automação (Roadmap)

- Python
- GitHub Actions

---

# Estrutura do Projeto

```
ElectionDashboard/

├── css/
├── data/
├── docs/
├── js/
├── index.html
├── README.md
├── CHANGELOG.md
└── requirements.txt
```

---

# Documentação

| Documento | Descrição |
|------------|-----------|
| architecture.md | Arquitetura do sistema |
| data-contract.md | Contrato oficial dos dados |
| roadmap.md | Planejamento das versões |

Toda documentação está disponível na pasta:

```
docs/
```

---

# Roadmap

| Versão | Status |
|---------|--------|
| v1.0.0 | ✅ |
| v1.1.0 | 🚧 |
| v1.2.0 | ⏳ ETL Python |
| v1.3.0 | ⏳ Integração TSE |
| v1.4.0 | ⏳ GitHub Actions |
| v2.0.0 | ⏳ Área Administrativa |
| v3.0.0 | ⏳ PostgreSQL + API |

---

# Atualização dos Dados

Atualmente:

```
CSV
        ↓
Dashboard
```

Próximas versões:

```
TSE

↓

Python ETL

↓

GitHub Actions

↓

pesquisas2026.csv

↓

GitHub Pages

↓

Dashboard
```

---

# Versionamento

O projeto utiliza Semantic Versioning.

```
MAJOR.MINOR.PATCH

1.2.0
```

---

# Licença

Este projeto está licenciado sob a licença MIT.

---

# Autor

**Allan dos Santos Silva**

GitHub

https://github.com/AllanSS91