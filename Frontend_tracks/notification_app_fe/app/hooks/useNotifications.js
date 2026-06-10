"use client";

import { useEffect, useMemo, useState } from "react";
import { normalizeNotification, rankNotifications } from "@/lib/notifications";

export function useNotifications({ type, limit, page, priority = false, refreshKey = 0 }) {
  const [rawNotifications, setRawNotifications] = useState([]);
  const [source, setSource] = useState("");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      params.set("limit", String(priority ? 50 : limit));
      params.set("page", String(priority ? 1 : page));

      if (type !== "all") {
        params.set("notification_type", type);
      }

      try {
        const response = await fetch(`/api/notifications?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load notifications.");
        }

        const payload = await response.json();
        setRawNotifications(payload.notifications || []);
        setSource(payload.source || "api");
        setWarning(payload.warning || "");
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [limit, page, priority, refreshKey, type]);

  const notifications = useMemo(() => {
    if (priority) {
      return rankNotifications(rawNotifications, limit);
    }

    return rawNotifications.map(normalizeNotification);
  }, [limit, priority, rawNotifications]);

  return {
    notifications,
    source,
    warning,
    loading,
    error,
  };
}
