# Data Contract
## Election Dashboard 2026

**Versão:** 1.1.0

---

# Objetivo

Este documento define a estrutura oficial da base de dados utilizada pelo Election Dashboard.

Todo componente do projeto (Dashboard, ETL, GitHub Actions e futuras integrações) deverá respeitar este contrato.

---

# Arquivo Oficial

```
data/pesquisas2026.csv
```

Formato:

- UTF-8
- Separador: vírgula (,)
- Primeira linha obrigatoriamente contém o cabeçalho.

---

# Estrutura da Base

| Campo | Tipo | Obrigatório | Exemplo |
|--------|------|-------------|----------|
| data | Date | Sim | 2026-08-05 |
| instituto | String | Sim | Quaest |
| candidato | String | Sim | Lula |
| partido | String | Sim | PT |
| uf | String | Sim | SP |
| regiao | String | Sim | Sudeste |
| turno | Integer | Sim | 1 |
| intencao_voto | Float | Sim | 43.5 |
| entrevistados | Integer | Sim | 2000 |
| margem_erro | Float | Sim | 2.0 |

---

# Regras de Validação

## data

- Formato obrigatório: AAAA-MM-DD

Exemplo:

```
2026-08-05
```

---

## instituto

Texto obrigatório.

Exemplo:

```
Quaest
```

---

## candidato

Texto obrigatório.

Exemplo:

```
Lula
```

---

## partido

Sigla oficial do partido.

Exemplo:

```
PT
PL
MDB
PSD
```

---

## uf

Utilizar apenas as 27 siglas oficiais.

Exemplo:

```
SP
RJ
MG
DF
```

---

## regiao

Valores permitidos:

- Norte
- Nordeste
- Centro-Oeste
- Sudeste
- Sul

---

## turno

Valores permitidos:

```
1
2
```

---

## intencao_voto

Número decimal.

Faixa permitida:

```
0 <= valor <= 100
```

---

## entrevistados

Número inteiro positivo.

Exemplo:

```
2000
```

---

## margem_erro

Número decimal.

Exemplo:

```
2.0
```

---

# Exemplo Completo

```csv
data,instituto,candidato,partido,uf,regiao,turno,intencao_voto,entrevistados,margem_erro
2026-08-05,Quaest,Lula,PT,SP,Sudeste,1,43.5,2000,2.0
2026-08-05,Quaest,Flávio Bolsonaro,PL,SP,Sudeste,1,39.8,2000,2.0
```

---

# Compatibilidade

As colunas abaixo não poderão ser:

- renomeadas;
- removidas;
- alteradas de tipo;

sem atualização da documentação e do dashboard.

Campos protegidos:

- data
- instituto
- candidato
- partido
- uf
- regiao
- turno
- intencao_voto
- entrevistados
- margem_erro

---

# Campos Planejados

Os campos abaixo poderão ser adicionados futuramente sem quebrar compatibilidade.

| Campo |
|--------|
| id_pesquisa |
| registro_tse |
| contratante |
| metodologia |
| inicio_coleta |
| fim_coleta |
| nivel_confianca |
| link_tse |

---

# Histórico

## v1.1.0

- Primeira versão oficial do contrato de dados.