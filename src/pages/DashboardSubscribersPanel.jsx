// src/pages/DashboardSubscribersPanel.jsx
import React from "react";
import useSubscribers from "../hooks/useSubscribers";
import AddSubscriberForm from "../components/AddSubscriberForm";
import SubscribersList from "../components/SubscribersList";
import DashboardMetrics from "../components/DashboardMetrics";

export default function DashboardSubscribersPanel() {
  const { subscribers, loading, add, update, remove, metrics } = useSubscribers();

  if (loading) return <div>Loading subscribers...</div>;

  return (
    <div style={{ padding: 20 }}>
      <DashboardMetrics metrics={metrics} />
      <h2>Subscribers</h2>
      <AddSubscriberForm onAdd={add} />
      <SubscribersList subscribers={subscribers} onUpdate={update} onDelete={remove} />
    </div>
  );
}
