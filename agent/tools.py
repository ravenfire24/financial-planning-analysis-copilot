from langchain.tools import tool
from utils.metrics import *
from data.loader import load_data


@tool
def get_revenue_vs_budget(month: str):
    """Return actual vs budget revenue for a given month."""
    actuals, budget, _, _ = load_data()
    act, bud = revenue_vs_budget(actuals, budget, month)
    return {"actual": act, "budget": bud}


@tool
def get_gross_margin(month: str):
    """Calculate gross margin for a given month."""
    actuals, _, _, _ = load_data()
    gm = gross_margin(actuals, month)
    return {"gross_margin": gm}


@tool
def get_opex_breakdown(month: str):
    """Return operating expense breakdown by account for a given month."""
    actuals, _, _, _ = load_data()

    data = opex_breakdown(actuals, month)

    if data is None:
        return {"error": f"No data available for {month}"}

    return data.to_dict()


@tool
def get_cash_runway():
    """Calculate company cash runway based on burn rate."""
    _, _, _, cash = load_data()
    runway = cash_runway(cash)
    return {"runway_months": runway}