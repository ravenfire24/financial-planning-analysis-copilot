"use client";

import {
  Activity,
  BadgeDollarSign,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  LineChart,
  Loader2,
  PieChart,
  Send,
  Upload,
  WalletCards,
} from "lucide-react";
import Papa from "papaparse";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";
import {
  AnalysisResult,
  CashRow,
  DataSet,
  FinancialRow,
  analyzeQuestion,
  buildSummary,
  cashRunway,
  formatCurrency,
  getLatestMonth,
  grossMargin,
  normalizeCashRows,
  normalizeFinancialRows,
  totalOpex,
  totalRevenue,
} from "@/lib/finance";

const chartColors = ["#126c6a", "#b84a62", "#c2892f", "#537188", "#7d5a50"];

type FileKey = "actuals" | "budget" | "cash";

type UploadStatus = Record<FileKey, string>;

const emptyStatus: UploadStatus = {
  actuals: "",
  budget: "",
  cash: "",
};

type PendingDataSet = {
  actuals: FinancialRow[];
  budget: FinancialRow[];
  cash: CashRow[];
};

const emptyPendingData: PendingDataSet = {
  actuals: [],
  budget: [],
  cash: [],
};

export function FpnaDashboard() {
  const [data, setData] = useState<DataSet | null>(null);
  const [pendingData, setPendingData] = useState<PendingDataSet>(emptyPendingData);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<UploadStatus>(emptyStatus);
  const [isParsing, setIsParsing] = useState(false);

  const summary = useMemo(() => {
    if (!data) {
      return null;
    }

    const latestMonth = getLatestMonth(data.actuals);
    return {
      latestMonth,
      revenue: totalRevenue(data.actuals),
      opex: totalOpex(data.actuals),
      margin: grossMargin(data.actuals, latestMonth),
      runway: cashRunway(data.cash),
    };
  }, [data]);

  function loadUploadedData() {
    if (!isReady(pendingData)) {
      return;
    }

    setData(pendingData);
    setResult(buildSummary(pendingData));
  }

  async function handleFileUpload(key: FileKey, file: File | null) {
    if (!file) {
      return;
    }

    setIsParsing(true);
    const text = await file.text();
    const rows = parseCsv(text);

    setPendingData((current) => {
      if (key === "cash") {
        return {
          ...current,
          cash: normalizeCashRows(rows),
        };
      }

      return {
        ...current,
        [key]: normalizeFinancialRows(rows),
      };
    });

    setStatus((current) => ({
      ...current,
      [key]: `${file.name}`,
    }));
    setResult(null);
    setIsParsing(false);
  }

  function askQuestion(nextQuery = query) {
    if (!data || !isReady(data)) {
      return;
    }

    setQuery(nextQuery);
    setResult(analyzeQuestion(nextQuery, data));
  }

  const ready = data ? isReady(data) : false;
  const uploadReady = isReady(pendingData);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" title="FP&A Copilot">
            <BarChart3 size={20} />
          </span>
          <div className="brand-copy">
            <p className="brand-title">FP&A Copilot</p>
          </div>
        </div>
      </header>

      <div className="main-grid">
        <aside className="panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <Upload size={17} />
              Financial Data
            </h2>
            <p className="panel-note">
              Upload CSVs. Files stay in the browser for the free version.
            </p>
          </div>
          <div className="panel-body">
            <div className="upload-stack">
              <FileUpload
                id="actuals"
                label="Actuals CSV"
                status={status.actuals}
                onChange={(file) => handleFileUpload("actuals", file)}
              />
              <FileUpload
                id="budget"
                label="Budget CSV"
                status={status.budget}
                onChange={(file) => handleFileUpload("budget", file)}
              />
              <FileUpload
                id="cash"
                label="Cash CSV"
                status={status.cash}
                onChange={(file) => handleFileUpload("cash", file)}
              />
              <button className="load-button" disabled={!uploadReady || isParsing} type="button" onClick={loadUploadedData}>
                {isParsing ? <Loader2 className="spin" size={16} /> : <FileSpreadsheet size={16} />}
                Load Data
              </button>
            </div>

          </div>
        </aside>

        <section className="workspace">
          <div className="hero-band" aria-label="Finance analytics workspace" />

          <section className="panel">
            <div className="panel-body">
              <div className="question-bar">
                <input
                  aria-label="Finance question"
                  className="question-input"
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      askQuestion();
                    }
                  }}
                  placeholder="Ask about revenue, margin, opex, or cash runway"
                  value={query}
                />
                <button className="ask-button" disabled={!ready || query.trim().length === 0} onClick={() => askQuestion()} type="button">
                  <Send size={16} />
                  Analyze
                </button>
              </div>
            </div>
          </section>

          {summary ? (
            <section className="metric-grid" aria-label="Finance metrics">
              <MetricCard icon={<BadgeDollarSign size={16} />} label="Total Revenue" sub="Uploaded actuals" value={formatCurrency(summary.revenue)} />
              <MetricCard icon={<Activity size={16} />} label="Latest Margin" sub={summary.latestMonth} value={`${(summary.margin * 100).toFixed(1)}%`} />
              <MetricCard icon={<PieChart size={16} />} label="Total Opex" sub="Uploaded actuals" value={formatCurrency(summary.opex)} />
              <MetricCard icon={<WalletCards size={16} />} label="Cash Runway" sub="Trailing burn" value={`${summary.runway.toFixed(1)} mo`} />
            </section>
          ) : null}

          <section className="result-grid">
            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">
                  <LineChart size={17} />
                  {result?.title ?? "Analysis"}
                </h2>
                <p className="panel-note">
                  {ready ? "Ask a question to generate an answer and chart." : "Upload all required CSVs, then press Load Data."}
                </p>
              </div>
              <div className="panel-body">
                {result ? (
                  <>
                    <p className="answer-text">{result.answer}</p>
                    <div className="chart-wrap">
                      <ResultChart result={result} />
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <FileSpreadsheet size={34} />
                    <span>Waiting for financial data</span>
                  </div>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">
                  <CheckCircle2 size={17} />
                  Insights
                </h2>
              </div>
              <div className="panel-body">
                {result ? (
                  <ul className="insight-list">
                    {result.highlights.map((highlight) => (
                      <li key={highlight}>
                        <CheckCircle2 size={15} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="insight-list">
                    <li>
                      <CheckCircle2 size={15} />
                      <span>Upload actuals, budget, and cash files.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={15} />
                      <span>Ask about revenue, margin, opex, or runway.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={15} />
                      <span>Review the answer, chart, and detail table.</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </section>

          {result?.tableRows.length ? (
            <section className="panel">
              <div className="panel-header">
                <h2 className="panel-title">
                  <FileSpreadsheet size={17} />
                  Detail Table
                </h2>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {Object.keys(result.tableRows[0]).map((key) => (
                        <th key={key}>{toTitle(key)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.tableRows.map((row, index) => (
                      <tr key={`${result.kind}-${index}`}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={`${result.kind}-${index}-${cellIndex}`}>{formatCell(value)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function FileUpload({
  id,
  label,
  onChange,
  status,
}: {
  id: string;
  label: string;
  onChange: (file: File | null) => void;
  status: string;
}) {
  return (
    <label className="file-row" htmlFor={id}>
      <span className="file-label">
        <span>{label}</span>
        {status ? <CheckCircle2 className="positive" size={15} /> : null}
      </span>
      <input
        accept=".csv,text/csv"
        className="file-input"
        id={id}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        type="file"
      />
      {status ? <span className="panel-note">{status}</span> : null}
    </label>
  );
}

function MetricCard({
  icon,
  label,
  sub,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  value: string;
}) {
  return (
    <div className="metric-card">
      <p className="metric-label">
        {icon}
        {label}
      </p>
      <p className="metric-value">{value}</p>
      <p className="metric-sub">{sub}</p>
    </div>
  );
}

function ResultChart({ result }: { result: AnalysisResult }) {
  if (result.chartType === "none" || result.chartData.length === 0) {
    return (
      <div className="empty-state">
        <BarChart3 size={30} />
        <span>No chart data available</span>
      </div>
    );
  }

  if (result.chartType === "pie") {
    return (
      <ResponsiveContainer height="100%" width="100%">
        <RechartsPieChart>
          <Pie data={result.chartData} dataKey="value" innerRadius={58} nameKey="name" outerRadius={104} paddingAngle={2}>
            {result.chartData.map((entry, index) => (
              <Cell fill={chartColors[index % chartColors.length]} key={entry.name} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        </RechartsPieChart>
      </ResponsiveContainer>
    );
  }

  if (result.chartType === "line") {
    return (
      <ResponsiveContainer height="100%" width="100%">
        <RechartsLineChart data={result.chartData} margin={{ bottom: 12, left: 12, right: 20, top: 24 }}>
          <CartesianGrid stroke="#d8e0ea" strokeDasharray="4 4" />
          <XAxis dataKey="name" tickLine={false} />
          <YAxis tickLine={false} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Line dataKey="value" dot={{ r: 4 }} stroke="#126c6a" strokeWidth={3} type="monotone" />
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer height="100%" width="100%">
      <BarChart data={result.chartData} margin={{ bottom: 12, left: 12, right: 20, top: 24 }}>
        <CartesianGrid stroke="#d8e0ea" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="name" tickLine={false} />
        <YAxis tickLine={false} />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {result.chartData.map((entry, index) => (
            <Cell fill={chartColors[index % chartColors.length]} key={entry.name} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function parseCsv(csv: string): unknown[] {
  const parsed = Papa.parse<Record<string, unknown>>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  return parsed.data;
}

function isReady(data: DataSet): boolean {
  return data.actuals.length > 0 && data.budget.length > 0 && data.cash.length > 0;
}

function toTitle(value: string): string {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase())
    .trim();
}

function formatCell(value: string | number): string {
  if (typeof value === "number") {
    return Math.abs(value) >= 1000 ? formatCurrency(value) : value.toString();
  }

  return value;
}
