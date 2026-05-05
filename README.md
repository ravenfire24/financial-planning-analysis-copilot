# Financial Planning & Analysis Copilot (AI FP&A Agent)

An AI-powered FP&A assistant that allows a CFO to ask natural language questions about financial performance and receive **accurate metrics + charts** in seconds.

Built using **LangGraph, LangChain, LlamaIndex, Hugging Face, FAISS, and Streamlit**.

---

##  Features

* 💬 Ask finance questions in plain English
* 📊 Automatic calculation of key FP&A metrics
* 📈 Interactive charts (Plotly)
* 🧠 Agent-based workflow (LangGraph)
* 📂 Works directly on structured CSV financial data

---

## 🧠 Supported Questions

Examples:

* “What was June 2025 revenue vs budget in USD?”
* “Show gross margin trend for the last 3 months.”
* “Break down Opex by category for June.”
* “What is our current cash runway?”

---

## 🎥 Demo


---

## 📁 Project Structure

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

## ⚙️ Setup Instructions

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






