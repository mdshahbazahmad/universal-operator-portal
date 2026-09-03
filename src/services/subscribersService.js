// src/services/subscribersService.js
import { db } from "../firebase";
import { ref, push, set, onValue, update, remove } from "firebase/database";

/**
 * Subscribe to realtime changes for all subscribers.
 * callback receives a plain object: { id: { ...fields... }, ... } or {}.
 * Returns the unsubscribe function.
 */
export function subscribeToSubscribers(callback) {
  const subscribersRef = ref(db, "subscribers");
  const unsubscribe = onValue(
    subscribersRef,
    (snapshot) => {
      const val = snapshot.val() || {};
      callback(val);
    },
    (err) => {
      console.error("subscribeToSubscribers error", err);
      callback({});
    }
  );
  return unsubscribe;
}

/**
 * Add a new subscriber. Data should include name, email, price, plan, status.
 * Returns the new key.
 */
export async function addSubscriber(data) {
  const newRef = push(ref(db, "subscribers"));
  const payload = {
    ...data,
    createdAt: Date.now(),
  };
  await set(newRef, payload);
  return newRef.key;
}

export async function updateSubscriber(id, updates) {
  const target = ref(db, `subscribers/${id}`);
  // Remove undefined fields to avoid writing 'undefined' to DB
  const clean = Object.entries(updates).reduce((acc, [k, v]) => {
    if (v !== undefined) acc[k] = v;
    return acc;
  }, {});
  if (clean.status === "active") {
    clean.lastActiveAt = Date.now();
  }
  await update(target, clean);
}

export async function deleteSubscriber(id) {
  await remove(ref(db, `subscribers/${id}`));
}
