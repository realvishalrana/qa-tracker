'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { PERMISSIONS } from '@/types';

type NavLink = {
  href: string;
  label: string;
  icon: string;
  permission?: (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
  badge?: number;
};

type SidebarProps = {
  links: NavLink[];
  showUsers: boolean;
  showAudit: boolean;
  unread: number;
  userName: string;
  roleLabel: string;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({
  links,
  showUsers,
  showAudit,
  unread,
  userName,
  roleLabel,
  onLogout,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  const allLinks: NavLink[] = [
    ...links.map((l) =>
      l.href === '/notifications' ? { ...l, badge: unread > 0 ? unread : undefined } : l
    ),
    ...(showUsers ? [{ href: '/admin/users', label: 'Users', icon: '👤' }] : []),
    ...(showAudit ? [{ href: '/admin/audit-logs', label: 'Audit', icon: '📋' }] : []),
  ];

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-slate-200 px-4">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onCloseMobile}>
          <span className="text-xl">🐞</span>
          <span className="font-display text-lg font-bold text-teal-900">QA Tracker</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {allLinks.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onCloseMobile}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                active
                  ? 'border-l-2 border-teal-600 bg-teal-50 text-teal-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <span className="text-base" aria-hidden>
                {link.icon}
              </span>
              <span className="flex-1">{link.label}</span>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="rounded-full bg-teal-600 px-2 py-0.5 text-xs text-white">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="mb-3">
          <p className="truncate text-sm font-medium text-slate-900">{userName}</p>
          <p className="truncate text-xs text-slate-500">{roleLabel}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-60 border-r border-slate-200 bg-white transition-transform lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {content}
      </aside>
    </>
  );
}

export const SIDEBAR_LINKS: Omit<NavLink, 'badge'>[] = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/projects', label: 'Projects', icon: '📁' },
  { href: '/bugs', label: 'Bugs', icon: '🐛' },
  { href: '/releases', label: 'Releases', icon: '🚀' },
  { href: '/reports', label: 'Reports', icon: '📈', permission: PERMISSIONS.REPORTS_READ },
  { href: '/notifications', label: 'Notifications', icon: '🔔' },
];
