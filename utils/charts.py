import plotly.express as px

def revenue_chart(actual, budget):
    df = {
        "Type": ["Actual", "Budget"],
        "Value": [actual, budget]
    }
    return px.bar(df, x="Type", y="Value", title="Revenue vs Budget")


def opex_chart(data):
    import pandas as pd

    if isinstance(data, dict):
        data = pd.Series(data)

    return px.pie(values=data.values, names=data.index, title="Opex Breakdown")