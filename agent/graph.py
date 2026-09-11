from langgraph.graph import StateGraph
from langchain_core.messages import HumanMessage
from agent.tools import *
from agent.llm import get_llm
import re
import pandas as pd
from data.loader import load_data

def get_latest_month():
    actuals, _, _, _ = load_data()
    return sorted(actuals["month"].unique())[-1]

def extract_month(query):
    months_map = {
        "january": "01", "february": "02", "march": "03",
        "april": "04", "may": "05", "june": "06",
        "july": "07", "august": "08", "september": "09",
        "october": "10", "november": "11", "december": "12"
    }

    query = query.lower()

    for m in months_map:

        if m in query:
            year = re.search(r"20\d{2}", query)

            if year:
                return f"{year.group()}-{months_map[m]}"
            else:                
                latest = get_latest_month()
                year_part = latest.split("-")[0]
                return f"{year_part}-{months_map[m]}"

    # fallback
    return get_latest_month()

def entry_node(state):    
    if isinstance(state, dict):
        return state
    return {"input": state}


llm = get_llm()

tools = [
    get_revenue_vs_budget,
    get_gross_margin,
    get_opex_breakdown,
    get_cash_runway
]

def router(state):
    return state
def route_decision(state):
    query = state.get("input", "").lower()

    if "revenue" in query:
        return "revenue"
    elif "margin" in query:
        return "margin"
    elif "opex" in query:
        return "opex"
    elif "cash" in query:
        return "cash"
    else:
        return "llm"

def revenue_node(state):
    if isinstance(state, str):
        state = {"input": state}

    query = state["input"]
    month = extract_month(query)

    result = get_revenue_vs_budget.invoke({"month": month})
    return {"input": state["input"], "output": result}

def margin_node(state):
    if isinstance(state, str):
        state = {"input": state}

    def get_last_3_months():
        actuals, _, _, _ = load_data()
        months = sorted(actuals["month"].unique())
        return months[-3:]

    trend = {}

    for m in get_last_3_months():
        gm = get_gross_margin.invoke({"month": m})
        trend[m] = gm["gross_margin"]

    return {"input": state["input"], "output": trend}

def opex_node(state):
    if isinstance(state, str):
        state = {"input": state}

    query = state["input"]
    month = extract_month(query)

    print("DEBUG QUERY:", query)
    print("DEBUG EXTRACTED MONTH:", month)

    result = get_opex_breakdown.invoke({"month": month})

    print("DEBUG TOOL RESULT:", result)

    return {"input": state["input"], "output": result}

def cash_node(state):
    if isinstance(state, str):
        state = {"input": state}

    result = get_cash_runway.invoke({})
    return {"input": state["input"], "output": result}

def llm_node(state):
    if isinstance(state, str):
        state = {"input": state}

    result = llm.invoke(state["input"])
    return {"input": state["input"], "output": result}

builder = StateGraph(dict)

builder.add_node("router", router)
builder.add_node("revenue", revenue_node)
builder.add_node("margin", margin_node)
builder.add_node("opex", opex_node)
builder.add_node("cash", cash_node)
builder.add_node("llm", llm_node)

builder.add_node("entry", entry_node)

builder.set_entry_point("entry")
builder.add_edge("entry", "router")

builder.add_conditional_edges(
    "router",
    route_decision,
    {
        "revenue": "revenue",
        "margin": "margin",
        "opex": "opex",
        "cash": "cash",
        "llm": "llm",
    }
)
graph = builder.compile()