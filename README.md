# Financial Planning & Analysis Copilot (AI FP&A Agent)
An AI-powered Financial Planning & Analysis (FP&A) assistant designed to help CFOs (Chief Financial Officer) and finance teams quickly analyze business performance using natural language questions.

This project combines full-stack development, data analytics, AI agents, and financial reporting into an interactive Streamlit application capable of transforming raw CSV financial data into board-ready insights and visualizations.

## Live App

```text
https://financial-planning-analysis-copilot.vercel.app
```

## Overview

This repository now includes a Vercel-ready Next.js version of the FP&A Copilot. The deployed app lets users upload financial CSV files, ask business questions, and generate finance answers with charts and detail tables.

The current production app is designed for a student portfolio and avoids paid infrastructure. It runs the analysis in the browser, so it does not require a database, object storage, or paid AI API key.

## What The App Does

- Uploads `actuals.csv`, `budget.csv`, and `cash.csv`
- Parses uploaded CSV files in the browser
- Validates finance rows with Zod
- Routes natural-language questions by intent
- Calculates FP&A metrics using TypeScript functions
- Shows KPI cards, written analysis, charts, and detail tables
- Deploys as a static Next.js app on Vercel

## Supported Analysis

The current app can answer questions about:

- Revenue vs budget
- Gross margin trend
- Opex breakdown
- Cash runway
- Executive summary metrics

## Example Questions

```text
What was June 2025 revenue vs budget?
Show gross margin trend for the last 3 months.
Break down opex by category for June.
What is our current cash runway?
```

## Data Format

### `actuals.csv`

```csv
month,entity,account,category,amount,currency
2025-06,US,Revenue,Revenue,140000,USD
2025-06,US,COGS,COGS,45000,USD
2025-06,US,Marketing,Opex,17000,USD
```

### `budget.csv`

```csv
month,entity,account,category,amount,currency
2025-06,US,Revenue,Revenue,145000,USD
2025-06,US,COGS,COGS,42000,USD
2025-06,US,Marketing,Opex,16000,USD
```

### `cash.csv`

```csv
month,cash,net_burn
2025-04,500000,40000
2025-05,460000,42000
2025-06,420000,45000
```

## Current Tech Stack

- Next.js 16
- React 19
- TypeScript
- Recharts
- PapaParse
- Zod
- Lucide React
- Vercel

## Original Python Prototype

The repo still includes the original Python/Streamlit prototype for reference:

- `app.py`
- `agent/`
- `data/`
- `index/`
- `utils/`
- `tests/`
- `requirements.txt`

That prototype uses Streamlit, Pandas, Plotly, LangGraph, LangChain, Hugging Face Transformers, FAISS, and LlamaIndex.

## Project Structure

```text
financial-planning-analysis-copilot/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    fpna-dashboard.tsx
  lib/
    finance.ts
    sample-data.ts
  public/
    finance-hero.png
  agent/
    graph.py
    llm.py
    tools.py
  data/
    loader.py
  index/
    vector_store.py
  utils/
    charts.py
    metrics.py
  tests/
    test_metrics.py
  app.py
  package.json
  requirements.txt
```

## Key Files

| File | Purpose |
| --- | --- |
| `components/fpna-dashboard.tsx` | Main interactive dashboard UI |
| `lib/finance.ts` | Finance routing, calculations, formatting, and validation |
| `lib/sample-data.ts` | Demo CSV data used by the app |
| `app/globals.css` | App styling and responsive layout |
| `public/finance-hero.png` | Homepage background image |
| `package.json` | Next.js scripts and dependencies |

## Run Locally

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploy To Vercel

The project is already deployed at:

```text
https://financial-planning-analysis-copilot.vercel.app
```

To deploy manually:

```bash
npx vercel deploy --prod
```

## Cost

The deployed version is built to run with no required paid services:

- Vercel Hobby hosting
- Browser-side CSV processing
- No database
- No server-side file storage
- No required LLM API calls

## Security Notes

Do not commit `.env` files, API keys, access tokens, database URLs, or private financial data. Uploaded CSV files are processed in the browser in the current Vercel version.
