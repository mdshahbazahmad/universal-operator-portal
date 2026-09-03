// src/hooks/useSubscribers.js
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  subscribeToSubscribers as _subscribeToSubscribers,
  addSubscriber as _addSubscriber,
  updateSubscriber as _updateSubscriber,
  deleteSubscriber as _deleteSubscriber,
} from "../services/subscribersService";

/**
 * Hook returns:
 * { subscribers, loading, add, update, remove, metrics }
 * subscribers: object id => subscriber
 */
export default function useSubscribers() {
  const [subscribers, setSubscribers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = _subscribeToSubscribers((data) => {
      setSubscribers(data || {});
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const add = useCallback(async (data) => {
    return await _addSubscriber(data);
  }, []);

  const update = useCallback(async (id, updates) => {
    return await _updateSubscriber(id, updates);
  }, []);

  const remove = useCallback(async (id) => {
    return await _deleteSubscriber(id);
  }, []);

  const metrics = useMemo(() => {
    const list = Object.entries(subscribers).map(([id, s]) => ({ id, ...s }));
    const total = list.length;
    const active = list.filter((s) => s.status === "active").length;
    const monthlyRevenue = list.reduce((sum, s) => {
      const price = Number(s.price || 0);
      if (!price) return sum;
      if (s.plan === "yearly") {
        // assume price is yearly total in dollars -> convert to monthly
        return sum + price / 12;
      }
      // monthly price
      return sum + price;
    }, 0);
    return {
      total,
      active,
      monthlyRevenue,
    };
  }, [subscribers]);

  return { subscribers, loading, add, update, remove, metrics };
}
