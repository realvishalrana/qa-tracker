import Link from 'next/link';
import type { NotificationItem } from '@/features/notifications/hooks/useNotifications';
import { Button } from '@/components/ui/Button';

type Props = {
  items: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
};

export function NotificationList({ items, onMarkRead, onMarkAllRead }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={onMarkAllRead}>
          Mark all read
        </Button>
      </div>
      <ul className="space-y-2">
        {items.map((n) => (
          <li
            key={n.id}
            className={`rounded-xl border p-4 ${n.isRead ? 'border-slate-200 bg-white' : 'border-teal-200 bg-teal-50'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">{n.title}</p>
                <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                {n.link && (
                  <Link href={n.link} className="mt-2 inline-block text-sm text-teal-700 hover:underline">
                    Open
                  </Link>
                )}
              </div>
              {!n.isRead && (
                <Button size="sm" variant="ghost" onClick={() => onMarkRead(n.id)}>
                  Mark read
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
