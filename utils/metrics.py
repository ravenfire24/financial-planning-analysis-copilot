def revenue_vs_budget(actuals, budget, month):
    act = actuals[(actuals["month"] == month) & (actuals["account"] == "Revenue")]
    bud = budget[(budget["month"] == month) & (budget["account"] == "Revenue")]

    return float(act["amount"].sum()), float(bud["amount"].sum())


def gross_margin(actuals, month):
    rev = actuals[(actuals["month"] == month) & (actuals["account"] == "Revenue")]["amount"].sum()
    cogs = actuals[(actuals["month"] == month) & (actuals["account"] == "COGS")]["amount"].sum()

    return (rev - cogs) / rev if rev else 0


def opex_breakdown(actuals, month):
    print("DEBUG MONTH FILTER:", month)
    print("DEBUG AVAILABLE MONTHS:", actuals["month"].unique())

    opex = actuals[
        (actuals["month"] == month) &
        (actuals["category"] == "Opex")
    ]

    if opex.empty:
        return None

    return opex.groupby("account")["amount"].sum()


def ebitda(actuals, month):
    rev = actuals[(actuals["month"] == month) & (actuals["account"] == "Revenue")]["amount"].sum()
    cogs = actuals[(actuals["month"] == month) & (actuals["account"] == "COGS")]["amount"].sum()
    opex = actuals[(actuals["month"] == month) & (actuals["category"] == "Opex")]["amount"].sum()

    return rev - cogs - opex


def cash_runway(cash_df):
    latest_cash = cash_df.sort_values("month").iloc[-1]["cash"]

    burn = cash_df.sort_values("month").tail(3)["net_burn"].mean()

    return latest_cash / burn if burn else 0