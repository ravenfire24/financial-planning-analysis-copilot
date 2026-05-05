import pandas as pd
import os

def load_data():
    print("=== DEBUG PATH ===")
    print("Current working dir:", os.getcwd())
    print("Actuals path:", os.path.abspath("data/actuals.csv"))

    actuals = pd.read_csv("data/actuals.csv")
    actuals["month"] = actuals["month"].astype(str).str.strip()

    print("=== DATA PREVIEW ===")
    print(actuals.head(20))
    print("=== UNIQUE MONTHS ===")
    print(actuals["month"].unique())

    budget = pd.read_csv("data/budget.csv")
    budget["month"] = budget["month"].astype(str).str.strip()

    fx = pd.read_csv("data/fx.csv")
    cash = pd.read_csv("data/cash.csv")

    return actuals, budget, fx, cash