# Election Dashboard 2026
## Arquitetura Oficial do Sistema

**Versão:** 1.1.0

**Status:** Em desenvolvimento

**Última atualização:** Agosto/2026

---

# 1. Objetivo

O Election Dashboard é uma aplicação web desenvolvida para análise, visualização e acompanhamento das pesquisas eleitorais brasileiras.

O projeto possui como objetivo principal disponibilizar uma plataforma moderna, rápida e totalmente automatizada para consulta de pesquisas eleitorais nacionais.

Inicialmente os dados são obtidos através de um arquivo CSV.

Nas próximas versões a atualização ocorrerá automaticamente através de um robô ETL desenvolvido em Python executado pelo GitHub Actions.

---

# 2. Objetivos do Projeto

O sistema deverá permitir:

- Visualização das pesquisas em tempo real
- Comparação entre candidatos
- Comparação entre institutos
- Evolução histórica
- Ranking de pesquisas
- Heatmap por estado
- Exportação para PNG
- Exportação para PDF
- Exportação para Excel
- Atualização automática da base de dados
- Publicação automática no GitHub Pages

---

# 3. Arquitetura Geral

                    Internet

                        │

                        ▼

               GitHub Pages

                        │

             Dashboard HTML

                        │

       ┌──────────────────────────┐
       │         JavaScript       │
       ├──────────────────────────┤
       │ app.js                   │
       │ charts.js                │
       │ filters.js               │
       │ map.js                   │
       │ utils.js                 │
       └──────────────────────────┘

                        │

                        ▼

              pesquisas2026.csv

                        ▲

                        │

             GitHub Actions

                        ▲

                        │

                ETL Python

                        ▲

                        │

            Portal Oficial do TSE

---

# 4. Tecnologias Utilizadas

Frontend

- HTML5
- CSS3
- Bootstrap 5
- JavaScript ES6

Bibliotecas

- ApexCharts
- Leaflet
- html2canvas
- jsPDF
- SheetJS

Backend (Planejado)

- Python 3
- GitHub Actions

Hospedagem

- GitHub Pages

Controle de versão

- Git
- GitHub

---

# 5. Estrutura do Projeto

ElectionDashboard/

│

├── index.html

├── css/

├── js/

│      app.js

│      charts.js

│      filters.js

│      map.js

│      utils.js

│

├── data/

│      pesquisas2026.csv

│

├── docs/

│      architecture.md

│      data-contract.md

│      roadmap.md

│      deployment.md

│      github-actions.md

│      robot.md

│

├── etl/

│      (versões futuras)

│

└── .github/

       workflows/

---

# 6. Fluxo dos Dados

1.

O Dashboard inicia.

↓

2.

app.js realiza a leitura do CSV.

↓

3.

Os dados são convertidos para objetos JavaScript.

↓

4.

Os filtros são carregados.

↓

5.

Os KPIs são calculados.

↓

6.

Os gráficos são desenhados.

↓

7.

O mapa do Brasil é atualizado.

---

# 7. Responsabilidade dos Módulos

## app.js

Responsável pelo ciclo principal da aplicação.

Funções:

- carregar CSV
- atualizar KPIs
- controlar tema
- controlar pesquisa rápida
- iniciar dashboard

---

## charts.js

Responsável exclusivamente pelos gráficos.

Nenhuma regra de negócio deverá ser implementada neste módulo.

---

## filters.js

Responsável pela criação dos filtros e aplicação das regras de filtragem.

---

## map.js

Responsável pela renderização do mapa do Brasil.

Todo cálculo espacial deverá permanecer neste módulo.

---

## utils.js

Responsável pelas funções utilitárias.

Exemplos:

- exportações
- debounce
- download
- canvas
- PDF

---

# 8. Princípios da Arquitetura

Este projeto seguirá obrigatoriamente os seguintes princípios.

## Modularidade

Cada arquivo possui apenas uma responsabilidade.

---

## Compatibilidade

Nenhuma alteração poderá quebrar versões anteriores.

---

## Simplicidade

Toda solução deverá priorizar legibilidade.

---

## Automação

Toda tarefa repetitiva deverá ser automatizada.

---

## Versionamento

Toda alteração deverá possuir documentação.

---

# 9. Roadmap Técnico

v1.0

Dashboard funcional.

✔ Concluído

v1.1

Documentação.

Em desenvolvimento.

v1.2

Estrutura do ETL.

Planejado.

v1.3

Robô Python.

Planejado.

v1.4

GitHub Actions.

Planejado.

v2.0

Painel Administrativo.

Planejado.

v3.0

Banco de Dados.

Planejado.

---

# 10. Política de Versionamento

O projeto seguirá Semantic Versioning.

MAJOR

Mudanças incompatíveis.

MINOR

Novas funcionalidades.

PATCH

Correções.

Exemplo

1.1.0

↓

1.2.0

↓

1.2.1

↓

1.3.0

---

# 11. Filosofia do Projeto

O objetivo não é apenas construir um dashboard.

O objetivo é desenvolver uma plataforma profissional de inteligência eleitoral, organizada, automatizada e preparada para crescimento contínuo.

Toda nova funcionalidade deverá respeitar esta arquitetura.
