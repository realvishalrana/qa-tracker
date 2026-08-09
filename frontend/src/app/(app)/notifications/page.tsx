'use client';

import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { NotificationList } from '@/features/notifications/components/NotificationList';

export default function NotificationsPage() {
  const { items, loading, error, markRead, markAllRead } = useNotifications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Notifications</h1>
        <p className="mt-1 text-slate-600">Assignments, status changes, and comments.</p>
      </div>
      {loading && <p className="text-slate-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && (
        <NotificationList items={items} onMarkRead={(id) => void markRead(id)} onMarkAllRead={() => void markAllRead()} />
      )}
    </div>
  );
}
