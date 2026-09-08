# Financial Planning & Analysis Copilot (AI FP&A Agent)
An AI-powered Financial Planning & Analysis (FP&A) assistant designed to help CFOs (Chief Financial Officer) and finance teams quickly analyze business performance using natural language questions.

This project combines full-stack development, data analytics, AI agents, and financial reporting into an interactive Streamlit application capable of transforming raw CSV financial data into board-ready insights and visualizations.

## Live Demo

Production app:

```text
https://financial-planning-analysis-copilot.vercel.app
```

## Current Version

The deployed version is a Vercel-ready rebuild of the original FP&A assistant. It uses a Next.js interface, browser-side CSV parsing, deterministic finance calculations, and interactive charts.

This version is designed to stay free for a student project:

- No paid AI API key required
- No paid database required
- No file storage service required
- Uploaded CSV files stay in browser memory
- Deploys on the Vercel Hobby plan

## Features

- Upload financial CSV files
- Ask finance questions in plain English
- Calculate revenue vs budget
- Analyze gross margin trends
- Break down operating expenses
- Estimate cash runway
- Display charts and detail tables
- Run as a production-style Next.js app on Vercel

## Supported Questions

Example questions the app can handle:

- What was June 2025 revenue vs budget?
- Show gross margin trend for the last 3 months.
- Break down opex by category for June.
- What is our current cash runway?

## CSV Files

The app expects these files:

| File | Purpose |
| --- | --- |
| `actuals.csv` | Actual monthly financial results |
| `budget.csv` | Budget or forecast values |
| `cash.csv` | Cash balance and net burn data |

The original Python prototype also includes `fx.csv` for currency conversion experiments.

## Tech Stack

### Deployed Vercel App

- Next.js
- TypeScript
- React
- Recharts
- PapaParse
- Zod
- Lucide React
- Vercel

### Original Python Prototype

- Python
- Streamlit
- Pandas
- NumPy
- Plotly
- LangGraph
- LangChain
- Hugging Face Transformers
- FAISS
- LlamaIndex
- Pytest

## Project Structure

```text
financial-planning-analysis-copilot/
  app/
    page.tsx
    layout.tsx
    globals.css
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
  utils/
    metrics.py
    charts.py
  tests/
    test_metrics.py
  app.py
  package.json
  requirements.txt
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

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

## Deployment

The app is deployed on Vercel:

```text
https://financial-planning-analysis-copilot.vercel.app
```

To deploy from the command line:

```bash
npx vercel deploy --prod
```

## Notes

This project keeps the cost low by avoiding paid backend services in the deployed version. The finance analysis runs in the browser, which makes the app easier to deploy, easier to demo, and suitable for a personal student portfolio.
