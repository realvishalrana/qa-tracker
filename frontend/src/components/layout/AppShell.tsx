'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Sidebar, SIDEBAR_LINKS } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useUnreadCount } from '@/features/notifications/hooks/useNotifications';
import { PERMISSIONS } from '@/types';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, hasPermission } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const unread = useUnreadCount(!!user, pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading session...
      </div>
    );
  }

  const visibleLinks = SIDEBAR_LINKS.filter((l) => !l.permission || hasPermission(l.permission));
  const roleLabel = (user.roleNames || user.roles?.map((r) => r.name) || []).join(', ') || 'No roles';

  function handleLogout() {
    void logout().then(() => router.push('/login'));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        links={visibleLinks}
        showUsers={hasPermission(PERMISSIONS.USERS_MANAGE)}
        showAudit={hasPermission(PERMISSIONS.AUDIT_READ)}
        unread={unread}
        userName={user.name}
        roleLabel={roleLabel}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="lg:pl-60">
        <TopBar
          unread={unread}
          userName={user.name}
          onMenuClick={() => setMobileOpen(true)}
          onLogout={handleLogout}
        />
        <main className="mx-auto max-w-7xl p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
