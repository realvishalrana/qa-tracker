'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Input } from '@/components/ui/Form';

type TopBarProps = {
  unread: number;
  userName: string;
  onMenuClick: () => void;
  onLogout: () => void;
};

function TopBarContent({ unread, userName, onMenuClick, onLogout }: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');

  const urlQ = pathname === '/bugs' ? (searchParams.get('q') ?? '') : '';

  useEffect(() => {
    setSearch(urlQ);
  }, [urlQ]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-6">
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-700 lg:hidden"
        aria-label="Open menu"
        onClick={onMenuClick}
      >
        <span className="flex flex-col gap-1">
          <span className="block h-0.5 w-4 bg-current" />
          <span className="block h-0.5 w-4 bg-current" />
          <span className="block h-0.5 w-4 bg-current" />
        </span>
      </button>
      <div className="hidden min-w-0 flex-1 sm:block">
        <Breadcrumbs />
      </div>
      <form
        className="ml-auto max-w-xs flex-1 sm:max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          const next = search.trim();
          router.push(next ? `/bugs?q=${encodeURIComponent(next)}` : '/bugs');
        }}
      >
        <Input
          placeholder="Search bugs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 text-sm"
        />
      </form>
      <Link
        href="/notifications"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Link>
      <div className="relative hidden items-center gap-2 sm:flex">
        <span className="max-w-[8rem] truncate text-sm font-medium text-slate-900">{userName}</span>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

function TopBarFallback() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-6" />
  );
}

export function TopBar(props: TopBarProps) {
  return (
    <Suspense fallback={<TopBarFallback />}>
      <TopBarContent {...props} />
    </Suspense>
  );
}
