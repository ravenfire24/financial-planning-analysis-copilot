import pandas as pd
from utils.metrics import (
    revenue_vs_budget,
    gross_margin,
    opex_breakdown,
    ebitda,
    cash_runway
)

def test_revenue_vs_budget():
    actuals = pd.DataFrame([
        {"month": "2025-06", "account": "Revenue", "amount": 100}
    ])
    budget = pd.DataFrame([
        {"month": "2025-06", "account": "Revenue", "amount": 120}
    ])

    act, bud = revenue_vs_budget(actuals, budget, "2025-06")

    assert act == 100
    assert bud == 120


def test_gross_margin():
    df = pd.DataFrame([
        {"month": "2025-06", "account": "Revenue", "amount": 100},
        {"month": "2025-06", "account": "COGS", "amount": 40},
    ])

    assert round(gross_margin(df, "2025-06"), 2) == 0.60


def test_opex_breakdown():
    df = pd.DataFrame([
        {"month": "2025-06", "category": "Opex", "account": "Marketing", "amount": 10},
        {"month": "2025-06", "category": "Opex", "account": "Salaries", "amount": 20},
    ])

    result = opex_breakdown(df, "2025-06")

    assert result["Marketing"] == 10
    assert result["Salaries"] == 20


def test_ebitda():
    df = pd.DataFrame([
        {"month": "2025-06", "account": "Revenue", "amount": 100},
        {"month": "2025-06", "account": "COGS", "amount": 40},
        {"month": "2025-06", "category": "Opex", "amount": 30},
    ])

    assert ebitda(df, "2025-06") == 30


def test_cash_runway():
    df = pd.DataFrame([
        {"month": "2025-04", "cash": 500, "net_burn": 50},
        {"month": "2025-05", "cash": 450, "net_burn": 50},
        {"month": "2025-06", "cash": 400, "net_burn": 50},
    ])

    assert cash_runway(df) == 8