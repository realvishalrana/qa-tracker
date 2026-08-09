'use client';

import { useCallback, useEffect, useState } from 'react';
import { notificationsApi } from '@/features/notifications/services/notificationsApi';

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
};

export function useNotifications() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationsApi.list();
      setItems(res.data as NotificationItem[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const markRead = useCallback(
    async (id: string) => {
      await notificationsApi.markRead(id);
      await reload();
    },
    [reload]
  );

  const markAllRead = useCallback(async () => {
    await notificationsApi.markAllRead();
    await reload();
  }, [reload]);

  return { items, loading, error, reload, markRead, markAllRead };
}

export function useUnreadCount(enabled = true, refreshKey?: string) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }
    notificationsApi
      .unreadCount()
      .then((res) => setCount(res.data.count))
      .catch(() => setCount(0));
  }, [enabled, refreshKey]);

  return count;
}
