# Financial Planning & Analysis Copilot (AI FP&A Agent)
An AI-powered Financial Planning & Analysis (FP&A) assistant designed to help CFOs (Chief Financial Officer) and finance teams quickly analyze business performance using natural language questions.

This project combines full-stack development, data analytics, AI agents, and financial reporting into an interactive Streamlit application capable of transforming raw CSV financial data into board-ready insights and visualizations.

Built using **LangGraph, LangChain, LlamaIndex, Hugging Face, FAISS, and Streamlit**.

---

##  Features

*  Ask finance questions in plain English
*  Automatic calculation of key FP&A metrics
*  Interactive charts (Plotly)
*  Agent-based workflow (LangGraph)
*  Works directly on structured CSV financial data

---

##  Supported Questions

Examples:

* “What was June 2025 revenue vs budget in USD?”
* “Show gross margin trend for the last 3 months.”
* “Break down Opex by category for June.”
* “What is our current cash runway?”

---

## 🎥 Demo

https://financial-planning-analysis-copilot-6wp5ttqdoqnknepuwttszg.streamlit.app/

##  Upload Your Data
Upload the required CSV files to begin using the FP&A Copilot:

* `actuals.csv`- This file contains real financial results.
* `budget.csv` - This file contains forecasted or planned numbers.
* `fx.csv`- This file contains conversion rates between currencies.
* `cash.csv`- This file tracks how much cash the company has over time.

Once all files are uploaded, you can start asking financial questions in natural language.

---

##  Project Structure

```
fpna-agent/
│
├── app.py                  # Streamlit UI
├── agent/
│   ├── graph.py           # LangGraph workflow
│   ├── tools.py           # Financial tools
│   ├── llm.py             # HuggingFace LLM
│
├── data/
│   ├── actuals.csv
│   ├── budget.csv
│   ├── fx.csv
│   ├── cash.csv
│   ├── loader.py
│
├── utils/
│   ├── metrics.py
│   ├── charts.py
│
├── index/
│   ├── vector_store.py    # FAISS + LlamaIndex
│
├── tests/
│   └── test_metrics.py
│
├── requirements.txt
└── README.md
```

---

##  Setup Instructions

### 1. Clone repo

```bash
git clone https://github.com/ravenfire24/financial-planning-analysis-copilot.git
cd financial-planning-analysis-copilot
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the app

```bash
python -m streamlit run app.py

```
---
## 🔧 Tech Stack

* **Frontend:** Streamlit
* **LLM:** Hugging Face (Mistral / LLaMA compatible)
* **Agent Framework:** LangGraph
* **Tooling:** LangChain
* **Data Layer:** Pandas
* **Vector Store:** FAISS
* **Indexing:** LlamaIndex
* **Visualization:** Plotly

 ![alt text](https://github.com/ravenfire24/financial-planning-analysis-copilot/blob/main/page.JPG)




