import { z } from "zod";

export type FinancialRow = {
  month: string;
  entity: string;
  account: string;
  category: string;
  amount: number;
  currency: string;
};

export type CashRow = {
  month: string;
  cash: number;
  netBurn: number;
};

export type DataSet = {
  actuals: FinancialRow[];
  budget: FinancialRow[];
  cash: CashRow[];
};

export type AnalysisKind = "revenue" | "margin" | "opex" | "cash" | "summary";

export type ChartDatum = {
  name: string;
  value: number;
};

export type AnalysisResult = {
  kind: AnalysisKind;
  title: string;
  answer: string;
  chartType: "bar" | "line" | "pie" | "none";
  chartData: ChartDatum[];
  tableRows: Array<Record<string, string | number>>;
  highlights: string[];
};

const financialRowSchema = z.object({
  month: z.string().min(1),
  entity: z.string().min(1),
  account: z.string().min(1),
  category: z.string().min(1),
  amount: z.coerce.number(),
  currency: z.string().min(1),
});

const cashRowSchema = z.object({
  month: z.string().min(1),
  cash: z.coerce.number(),
  net_burn: z.coerce.number(),
});

export function normalizeFinancialRows(rows: unknown[]): FinancialRow[] {
  return rows
    .map((row) => financialRowSchema.safeParse(row))
    .filter((result) => result.success)
    .map((result) => {
      const row = result.data;
      return {
        month: row.month.trim(),
        entity: row.entity.trim(),
        account: row.account.trim(),
        category: row.category.trim(),
        amount: row.amount,
        currency: row.currency.trim(),
      };
    });
}

export function normalizeCashRows(rows: unknown[]): CashRow[] {
  return rows
    .map((row) => cashRowSchema.safeParse(row))
    .filter((result) => result.success)
    .map((result) => {
      const row = result.data;
      return {
        month: row.month.trim(),
        cash: row.cash,
        netBurn: row.net_burn,
      };
    });
}

export function getLatestMonth(rows: FinancialRow[]): string {
  return [...new Set(rows.map((row) => row.month))].sort().at(-1) ?? "";
}

export function extractMonth(query: string, rows: FinancialRow[]): string {
  const latest = getLatestMonth(rows);
  const months: Record<string, string> = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };

  const normalized = query.toLowerCase();
  const explicitMonth = normalized.match(/20\d{2}-(0[1-9]|1[0-2])/);

  if (explicitMonth) {
    return explicitMonth[0];
  }

  for (const [name, value] of Object.entries(months)) {
    if (normalized.includes(name)) {
      const year = normalized.match(/20\d{2}/)?.[0] ?? latest.split("-")[0];
      return `${year}-${value}`;
    }
  }

  return latest;
}

export function routeQuestion(query: string): AnalysisKind {
  const normalized = query.toLowerCase();

  if (normalized.includes("cash") || normalized.includes("runway") || normalized.includes("burn")) {
    return "cash";
  }

  if (normalized.includes("opex") || normalized.includes("expense") || normalized.includes("spend")) {
    return "opex";
  }

  if (normalized.includes("margin") || normalized.includes("gross")) {
    return "margin";
  }

  if (normalized.includes("revenue") || normalized.includes("budget") || normalized.includes("variance")) {
    return "revenue";
  }

  return "summary";
}

export function revenueVsBudget(actuals: FinancialRow[], budget: FinancialRow[], month: string) {
  const actual = sumAmount(actuals, month, "Revenue");
  const planned = sumAmount(budget, month, "Revenue");
  const variance = actual - planned;
  const variancePct = planned === 0 ? 0 : variance / planned;

  return {
    actual,
    planned,
    variance,
    variancePct,
  };
}

export function grossMargin(actuals: FinancialRow[], month: string): number {
  const revenue = sumAmount(actuals, month, "Revenue");
  const cogs = sumAmount(actuals, month, "COGS");

  return revenue === 0 ? 0 : (revenue - cogs) / revenue;
}

export function grossMarginTrend(actuals: FinancialRow[]): ChartDatum[] {
  return [...new Set(actuals.map((row) => row.month))]
    .sort()
    .slice(-3)
    .map((month) => ({
      name: month,
      value: Number((grossMargin(actuals, month) * 100).toFixed(1)),
    }));
}

export function opexBreakdown(actuals: FinancialRow[], month: string): ChartDatum[] {
  const byAccount = new Map<string, number>();

  actuals
    .filter((row) => row.month === month && row.category.toLowerCase() === "opex")
    .forEach((row) => {
      byAccount.set(row.account, (byAccount.get(row.account) ?? 0) + row.amount);
    });

  return [...byAccount.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function cashRunway(cash: CashRow[]): number {
  const sorted = [...cash].sort((a, b) => a.month.localeCompare(b.month));
  const latestCash = sorted.at(-1)?.cash ?? 0;
  const recentBurn = sorted.slice(-3);
  const averageBurn =
    recentBurn.reduce((total, row) => total + row.netBurn, 0) / Math.max(recentBurn.length, 1);

  return averageBurn === 0 ? 0 : latestCash / averageBurn;
}

export function analyzeQuestion(query: string, data: DataSet): AnalysisResult {
  const kind = routeQuestion(query);
  const month = extractMonth(query, data.actuals);

  if (kind === "cash") {
    const runway = cashRunway(data.cash);
    return {
      kind,
      title: "Cash Runway",
      answer: `The company has approximately ${runway.toFixed(1)} months of cash runway based on the latest cash balance and the trailing three-month average burn.`,
      chartType: "line",
      chartData: data.cash
        .slice()
        .sort((a, b) => a.month.localeCompare(b.month))
        .map((row) => ({ name: row.month, value: row.cash })),
      tableRows: data.cash.map((row) => ({
        month: row.month,
        cash: row.cash,
        netBurn: row.netBurn,
      })),
      highlights: [
        `Latest cash balance is ${formatCurrency(data.cash.sort((a, b) => a.month.localeCompare(b.month)).at(-1)?.cash ?? 0)}.`,
        "Runway uses the trailing three-month average burn rate.",
      ],
    };
  }

  if (kind === "opex") {
    const breakdown = opexBreakdown(data.actuals, month);
    const total = breakdown.reduce((sum, item) => sum + item.value, 0);
    return {
      kind,
      title: `Opex Breakdown for ${month}`,
      answer:
        breakdown.length > 0
          ? `Total operating expense for ${month} is ${formatCurrency(total)}. The largest category is ${breakdown[0].name} at ${formatCurrency(breakdown[0].value)}.`
          : `No operating expense data was found for ${month}.`,
      chartType: breakdown.length > 0 ? "pie" : "none",
      chartData: breakdown,
      tableRows: breakdown.map((row) => ({
        account: row.name,
        amount: row.value,
        share: total === 0 ? "0.0%" : formatPercent(row.value / total),
      })),
      highlights: [
        `${breakdown.length} opex categories found.`,
        "This view groups all entities by account.",
      ],
    };
  }

  if (kind === "margin") {
    const trend = grossMarginTrend(data.actuals);
    const latest = trend.at(-1);
    return {
      kind,
      title: "Gross Margin Trend",
      answer: latest
        ? `Gross margin for ${latest.name} is ${latest.value.toFixed(1)}%. The trend is calculated from revenue and COGS in the actuals file.`
        : "No gross margin data was found.",
      chartType: "line",
      chartData: trend,
      tableRows: trend.map((row) => ({
        month: row.name,
        grossMargin: `${row.value.toFixed(1)}%`,
      })),
      highlights: [
        "Gross margin is calculated as revenue minus COGS divided by revenue.",
        "The chart shows the latest three available months.",
      ],
    };
  }

  if (kind === "revenue") {
    const result = revenueVsBudget(data.actuals, data.budget, month);
    const direction = result.variance >= 0 ? "above" : "below";
    return {
      kind,
      title: `Revenue vs Budget for ${month}`,
      answer: `Actual revenue is ${formatCurrency(result.actual)} versus budget of ${formatCurrency(result.planned)}. That is ${formatCurrency(Math.abs(result.variance))} ${direction} budget, or ${formatPercent(Math.abs(result.variancePct))}.`,
      chartType: "bar",
      chartData: [
        { name: "Actual", value: result.actual },
        { name: "Budget", value: result.planned },
      ],
      tableRows: [
        {
          metric: "Actual Revenue",
          value: result.actual,
        },
        {
          metric: "Budget Revenue",
          value: result.planned,
        },
        {
          metric: "Variance",
          value: result.variance,
        },
      ],
      highlights: [
        `Variance is ${result.variance >= 0 ? "favorable" : "unfavorable"}.`,
        "Revenue is grouped across all uploaded entities.",
      ],
    };
  }

  return buildSummary(data);
}

export function buildSummary(data: DataSet): AnalysisResult {
  const latestMonth = getLatestMonth(data.actuals);
  const revenue = revenueVsBudget(data.actuals, data.budget, latestMonth);
  const margin = grossMargin(data.actuals, latestMonth);
  const runway = cashRunway(data.cash);

  return {
    kind: "summary",
    title: `Executive Summary for ${latestMonth}`,
    answer: `For ${latestMonth}, revenue is ${formatCurrency(revenue.actual)}, gross margin is ${formatPercent(margin)}, and cash runway is ${runway.toFixed(1)} months.`,
    chartType: "bar",
    chartData: [
      { name: "Revenue", value: revenue.actual },
      { name: "Budget", value: revenue.planned },
      { name: "Opex", value: opexBreakdown(data.actuals, latestMonth).reduce((sum, row) => sum + row.value, 0) },
    ],
    tableRows: [
      { metric: "Revenue", value: revenue.actual },
      { metric: "Budget", value: revenue.planned },
      { metric: "Gross Margin", value: formatPercent(margin) },
      { metric: "Runway", value: `${runway.toFixed(1)} months` },
    ],
    highlights: [
      "Ask about revenue, margin, opex, or cash runway.",
      "All analysis runs in the browser, so no paid backend is required.",
    ],
  };
}

export function totalRevenue(actuals: FinancialRow[]): number {
  return actuals
    .filter((row) => row.account === "Revenue")
    .reduce((sum, row) => sum + row.amount, 0);
}

export function totalOpex(actuals: FinancialRow[]): number {
  return actuals
    .filter((row) => row.category.toLowerCase() === "opex")
    .reduce((sum, row) => sum + row.amount, 0);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
    style: "percent",
  }).format(value);
}

function sumAmount(rows: FinancialRow[], month: string, account: string): number {
  return rows
    .filter((row) => row.month === month && row.account === account)
    .reduce((sum, row) => sum + row.amount, 0);
}
