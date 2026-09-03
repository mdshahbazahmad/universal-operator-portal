// src/components/DashboardMetrics.jsx
import React from "react";

export default function DashboardMetrics({ metrics }) {
  const { total = 0, active = 0, monthlyRevenue = 0 } = metrics || {};
  return (
    <div className="metrics-row" style={{ display: "flex", gap: 24, marginBottom: 20 }}>
      <div className="metric-card" style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
        <div className="metric-label" style={{ fontSize: 12, color: "#666" }}>Total Subscribers</div>
        <div className="metric-value" style={{ fontSize: 24, fontWeight: 700 }}>{total}</div>
      </div>
      <div className="metric-card" style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
        <div className="metric-label" style={{ fontSize: 12, color: "#666" }}>Active Connections</div>
        <div className="metric-value" style={{ fontSize: 24, fontWeight: 700 }}>{active}</div>
      </div>
      <div className="metric-card" style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
        <div className="metric-label" style={{ fontSize: 12, color: "#666" }}>Monthly Revenue</div>
        <div className="metric-value" style={{ fontSize: 24, fontWeight: 700 }}>${Number(monthlyRevenue || 0).toFixed(2)}</div>
      </div>
    </div>
  );
}
