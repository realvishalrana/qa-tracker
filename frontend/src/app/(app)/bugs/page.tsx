'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBugs } from '@/features/bugs/hooks/useBugs';
import { BugList } from '@/features/bugs/components/BugList';
import { BugFilters } from '@/features/bugs/components/BugFilters';
import { Pagination } from '@/components/ui/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

function BugsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQ = searchParams.get('q') ?? '';
  const [filters, setFilters] = useState<Record<string, string>>({ q: urlQ });
  const [page, setPage] = useState(1);
  const debouncedQ = useDebounce(filters.q || '', 300);
  const query = { ...filters, q: debouncedQ || undefined };

  useEffect(() => {
    setFilters((prev) => (prev.q === urlQ ? prev : { ...prev, q: urlQ }));
    setPage(1);
  }, [urlQ]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, filters.status, filters.severity, filters.priority]);

  const { bugs, meta, loading, error, limit } = useBugs(query, page);

  function handleFilterChange(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === 'q') {
      const next = value.trim();
      router.replace(next ? `/bugs?q=${encodeURIComponent(next)}` : '/bugs');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Bugs</h1>
        <p className="mt-1 text-slate-600">Search and filter issues across your projects.</p>
      </div>
      <BugFilters values={filters} onChange={handleFilterChange} />
      {loading && <p className="text-slate-500">Loading bugs...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && (
        <>
          <BugList bugs={bugs} />
          <Pagination
            page={page}
            limit={limit}
            total={meta.total ?? bugs.length}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default function BugsPage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Loading bugs...</p>}>
      <BugsPageContent />
    </Suspense>
  );
}
