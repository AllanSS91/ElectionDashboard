# Roadmap
## Election Dashboard 2026

**Versão:** 1.1.0

---

# Objetivo

Este documento apresenta o planejamento de evolução do Election Dashboard.

Cada versão possui um conjunto definido de funcionalidades, mantendo compatibilidade com as versões anteriores.

---

# Status do Projeto

| Versão | Status |
|---------|--------|
| v1.0.0 | ✅ Concluída |
| v1.1.0 | 🚧 Em desenvolvimento |
| v1.2.0 | ⏳ Planejada |
| v1.3.0 | ⏳ Planejada |
| v1.4.0 | ⏳ Planejada |
| v2.0.0 | ⏳ Planejada |
| v3.0.0 | ⏳ Planejada |

---

# v1.0.0

## Dashboard Inicial

### Concluído

- Dashboard HTML
- Bootstrap
- ApexCharts
- Leaflet
- KPIs
- Filtros
- Exportação PNG
- Exportação PDF
- Exportação Excel
- Leitura do CSV

Status:

✅ Finalizado

---

# v1.1.0

## Foundation

### Objetivos

- Documentação da arquitetura
- Contrato dos dados
- Roadmap
- Organização do repositório

Arquivos criados

- docs/architecture.md
- docs/data-contract.md
- docs/roadmap.md

Status

🚧 Em desenvolvimento

---

# v1.2.0

## ETL Foundation

Objetivos

- Estrutura do projeto Python
- Configuração inicial
- Validação do CSV
- Logger
- Arquivo de configuração
- Testes locais

Estrutura prevista

```
etl/

config.py

main.py

extractor.py

transformer.py

validator.py

exporter.py

logger.py
```

Status

⏳ Planejado

---

# v1.3.0

## ETL TSE

Objetivos

- Consulta automática ao TSE
- Download das pesquisas
- Conversão para CSV
- Atualização automática da base

Status

⏳ Planejado

---

# v1.4.0

## GitHub Actions

Objetivos

- Workflow automático
- Execução diária
- Commit automático
- Atualização do GitHub Pages

Status

⏳ Planejado

---

# v1.5.0

## Dashboard Analytics

Objetivos

- Média ponderada
- Evolução dos candidatos
- Comparação entre institutos
- Indicadores adicionais
- Melhorias de desempenho

Status

⏳ Planejado

---

# v2.0.0

## Administração

Objetivos

- Login
- Área administrativa
- Upload manual do CSV
- Auditoria
- Controle de permissões

Status

⏳ Planejado

---

# v3.0.0

## Plataforma

Objetivos

- PostgreSQL
- API REST
- Cache
- Dashboard em tempo real
- Escalabilidade

Status

⏳ Planejado

---

# Princípios

Todo desenvolvimento deverá seguir:

- Compatibilidade com versões anteriores.
- Código modular.
- Documentação obrigatória.
- Versionamento semântico.
- Testes antes de cada release.

---

# Critério para Releases

Uma versão somente poderá ser publicada quando:

- Toda documentação estiver atualizada.
- Código revisado.
- Dashboard funcionando.
- GitHub atualizado.
- CHANGELOG atualizado.

---

# Histórico

## v1.1.0

- Criação do roadmap oficial.