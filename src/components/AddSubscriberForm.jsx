// src/components/AddSubscriberForm.jsx
import React, { useState } from "react";

export default function AddSubscriberForm({ onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("monthly");
  const [price, setPrice] = useState(""); // dollars
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !price) return alert("Name, email and price required");
    const payload = {
      name,
      email,
      plan,
      price: parseFloat(price),
      status: "active",
    };
    try {
      setSubmitting(true);
      await onAdd(payload);
      setName("");
      setEmail("");
      setPrice("");
      setPlan("monthly");
    } catch (err) {
      console.error(err);
      alert("Failed to add subscriber");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-subscriber-form" style={{ marginBottom: 16 }}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        style={{ marginRight: 8 }}
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        style={{ marginRight: 8 }}
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Monthly price (e.g. 9.99)"
        type="number"
        step="0.01"
        style={{ marginRight: 8, width: 140 }}
      />
      <select value={plan} onChange={(e) => setPlan(e.target.value)} style={{ marginRight: 8 }}>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Subscriber'}</button>
    </form>
  );
}
