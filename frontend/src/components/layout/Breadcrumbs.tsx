'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  bugs: 'Bugs',
  releases: 'Releases',
  reports: 'Reports',
  notifications: 'Notifications',
  admin: 'Admin',
  users: 'Users',
  'audit-logs': 'Audit',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (!segments.length) return null;

  const crumbs: { href: string; label: string }[] = [];
  let path = '';
  for (const seg of segments) {
    path += `/${seg}`;
    const label = LABELS[seg] || (seg.length > 20 ? `${seg.slice(0, 8)}…` : seg);
    crumbs.push({ href: path, label });
  }

  return (
    <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href}>
          {i > 0 && <span className="mx-1.5 text-slate-300">/</span>}
          {i < crumbs.length - 1 ? (
            <Link href={crumb.href} className="hover:text-teal-700">
              {crumb.label}
            </Link>
          ) : (
            <span className="font-medium text-slate-700">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
