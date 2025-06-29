import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

export interface MetricsData {
  total_word_count: number;
  unique_word_count: number;
  average_sentence_length: number;
  flesch_kincaid_grade_level: number;
  top_10_words: [string, number][];
}

export interface MetricsProps {
  metrics: MetricsData;
}

const Metrics: React.FC<MetricsProps> = ({ metrics }) => {
  const [view, setView] = useState<"table" | "chart">("table");

  // Defensive: handle undefined/null metrics
  if (!metrics) {
    return (
      <section className="metrics">
        <h2>Analysis Results</h2>
        <p>No metrics data available.</p>
      </section>
    );
  }

  // Prepare data for recharts
  const chartData =
    metrics.top_10_words?.map(([word, count]: [string, number]) => ({
      word,
      count,
    })) ?? [];

  return (
    <section className="metrics">
      <h2>Analysis Results</h2>
      <table>
        <tbody>
          <tr>
            <th>Total words</th>
            <td>{metrics.total_word_count}</td>
          </tr>
          <tr>
            <th>Unique words</th>
            <td>{metrics.unique_word_count}</td>
          </tr>
          <tr>
            <th>Average sentence length</th>
            <td>{metrics.average_sentence_length}</td>
          </tr>
          <tr>
            <th>Flesch–Kincaid grade</th>
            <td>{metrics.flesch_kincaid_grade_level}</td>
          </tr>
        </tbody>
      </table>

      <h3>Top 10 words</h3>
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setView("table")}
          style={{
            marginRight: 8,
            background: view === "table" ? "#1976d2" : "#e0e7ef",
            color: view === "table" ? "#fff" : "#333",
            fontWeight: view === "table" ? 600 : 400,
            border: "none",
            borderRadius: 4,
            padding: "0.3rem 1rem",
            cursor: "pointer",
            outline: view === "table" ? "2px solid #1976d2" : "none",
            transition: "background 0.2s",
          }}
          aria-pressed={view === "table"}
        >
          Table
        </button>
        <button
          onClick={() => setView("chart")}
          style={{
            background: view === "chart" ? "#1976d2" : "#e0e7ef",
            color: view === "chart" ? "#fff" : "#333",
            fontWeight: view === "chart" ? 600 : 400,
            border: "none",
            borderRadius: 4,
            padding: "0.3rem 1rem",
            cursor: "pointer",
            outline: view === "chart" ? "2px solid #1976d2" : "none",
            transition: "background 0.2s",
          }}
          aria-pressed={view === "chart"}
        >
          Chart
        </button>
      </div>
      {view === "table" ? (
        <ol className="word-list">
          {Array.isArray(metrics.top_10_words) &&
          metrics.top_10_words.length > 0 ? (
            metrics.top_10_words.map(([word, count]: [string, number]) => (
              <li key={word}>
                {word}: {count}
              </li>
            ))
          ) : (
            <li>No data</li>
          )}
        </ol>
      ) : (
        <div style={{ width: "100%", height: 320, maxWidth: 600 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={chartData}
                margin={{ top: 36, right: 24, left: 8, bottom: 32 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="word"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={60}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2">
                  <LabelList dataKey="count" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data to display.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Metrics;
