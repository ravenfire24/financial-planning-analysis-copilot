# Financial Planning & Analysis Copilot (AI FP&A Agent)
An AI-powered Financial Planning & Analysis (FP&A) assistant designed to help CFOs (Chief Financial Officer) and finance teams quickly analyze business performance using natural language questions.

This project combines full-stack development, data analytics, AI agents, and financial reporting into an interactive Streamlit application capable of transforming raw CSV financial data into board-ready insights and visualizations.

Live App:  https://financial-planning-analysis-copilot.vercel.app

![alt text](page.JPG)

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

`actuals.csv`
`budget.csv`
`cash.csv`



## Current Tech Stack

- Next.js 16
- React 19
- TypeScript
- Recharts
- PapaParse
- Zod
- Lucide React
- Vercel

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


