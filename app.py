import streamlit as st
import plotly.express as px
from agent.graph import graph
from utils.charts import *
from agent.tools import *
import streamlit as st
import plotly.express as px
from agent.graph import graph
from utils.charts import *
from agent.tools import *
import os

st.title(" Financial Planning & Analysis Copilot")

st.subheader("Upload your financial data")

uploaded_actuals = st.file_uploader("Upload actuals.csv", type="csv")
uploaded_budget = st.file_uploader("Upload budget.csv", type="csv")
uploaded_fx = st.file_uploader("Upload fx.csv", type="csv")
uploaded_cash = st.file_uploader("Upload cash.csv", type="csv")

# upload the csv files
os.makedirs("data", exist_ok=True)

files_uploaded = all([uploaded_actuals, uploaded_budget, uploaded_fx, uploaded_cash])

if files_uploaded:
    with open("data/actuals.csv", "wb") as f:
        f.write(uploaded_actuals.getbuffer())

    with open("data/budget.csv", "wb") as f:
        f.write(uploaded_budget.getbuffer())

    with open("data/fx.csv", "wb") as f:
        f.write(uploaded_fx.getbuffer())

    with open("data/cash.csv", "wb") as f:
        f.write(uploaded_cash.getbuffer())

    st.success("✅ Files uploaded successfully!")
else:
    st.warning("⚠️ Please upload all required CSV files.")

st.title(" Financial Planning & Analysis Copilot")

query = None

if files_uploaded:
    query = st.text_input("Ask a finance question")

if query:
    print("USER INPUT:", query)
    result = graph.invoke({"input": query})

    st.write("### Answer")

    output = result["output"]   
    if isinstance(output, dict) and "error" in output:
        st.write(output["error"])
        st.stop()   

    #  Revenue
    if isinstance(output, dict) and "actual" in output:
        st.write(f"Actual Revenue: ${output['actual']:,}")
        st.write(f"Budget Revenue: ${output['budget']:,}")
        
        variance = output["actual"] - output["budget"]
        pct = (variance / output["budget"]) * 100 if output["budget"] != 0 else 0

        sign = "above" if variance > 0 else "below"
        st.write(f"Variance: ${variance:,} ({pct:.1f}% {sign} budget)")

        chart = revenue_chart(output["actual"], output["budget"])
        st.plotly_chart(chart)

    # Margin trend
    elif isinstance(output, dict) and all("-" in k for k in output.keys()):
        df = {
            "Month": list(output.keys()),
            "Gross Margin": list(output.values())
        }
        fig = px.line(df, x="Month", y="Gross Margin", title="Gross Margin Trend")
        st.plotly_chart(fig)

    #  Opex
    elif isinstance(output, dict) and "runway_months" not in output:
        for k, v in output.items():
            st.write(f"{k}: ${v:,}")

        chart = opex_chart(output)
        st.plotly_chart(chart)

    #  Cash
    elif isinstance(output, dict) and "runway_months" in output:
        st.write(f"Cash Runway: {round(output['runway_months'], 2)} months")
