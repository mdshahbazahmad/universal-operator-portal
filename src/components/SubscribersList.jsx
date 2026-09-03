// src/components/SubscribersList.jsx
import React from "react";

export function SubscriberItem({ id, subscriber, onUpdate, onDelete }) {
  const { name, email, status, plan, price } = subscriber;
  return (
    <div className="subscriber-item" style={{ display: "flex", gap: 8, alignItems: "center", padding: 8, borderBottom: "1px solid #f0f0f0" }}>
      <div style={{ flex: 1 }}>
        <div><strong>{name}</strong> <small style={{ color: '#666' }}>({email})</small></div>
        <div style={{ color: '#333' }}>{plan} — ${Number(price || 0).toFixed(2)} / {plan === "yearly" ? "yr" : "mo"}</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onUpdate(id, { status: status === "active" ? "inactive" : "active" })}>
          {status === "active" ? "Deactivate" : "Activate"}
        </button>
        <button onClick={() => { if (confirm('Delete this subscriber?')) onDelete(id); }} style={{ marginLeft: 8 }}>Delete</button>
      </div>
    </div>
  );
}

export default function SubscribersList({ subscribers, onUpdate, onDelete }) {
  const entries = Object.entries(subscribers || {});
  if (!entries.length) return <div>No subscribers yet</div>;
  return (
    <div className="subscribers-list">
      {entries.map(([id, subscriber]) => (
        <SubscriberItem key={id} id={id} subscriber={subscriber} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}
