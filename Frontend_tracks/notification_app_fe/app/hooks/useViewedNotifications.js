"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "campus-notification-viewed";

export function useViewedNotifications() {
  const [viewedIds, setViewedIds] = useState(new Set());

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setViewedIds(new Set(JSON.parse(saved)));
    }
  }, []);

  function toggleViewed(id) {
    setViewedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  return {
    viewedIds,
    toggleViewed,
  };
}
