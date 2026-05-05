import streamlit as st
import plotly.express as px
from agent.graph import graph
from utils.charts import *
from agent.tools import *

st.title(" Financial Planning & Analysis Copilot")

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
