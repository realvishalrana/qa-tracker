'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReleaseItem } from '@/features/releases/hooks/useReleases';
import { bugsApi } from '@/features/bugs/services/bugsApi';
import { featuresApi } from '@/features/projects/services/projectsApi';
import { Button } from '@/components/ui/Button';
import { Label, Select } from '@/components/ui/Form';
import type { Bug, Feature } from '@/types';

type Props = {
  release: ReleaseItem;
  onLink: (bugIds: string[]) => Promise<void>;
};

export function ReleaseBugLinker({ release, onLink }: Props) {
  const projectId = release.project?.id;
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [featureShortcut, setFeatureShortcut] = useState('');
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    void Promise.all([bugsApi.list({ projectId }), featuresApi.list(projectId)])
      .then(([bugsRes, featuresRes]) => {
        setBugs(bugsRes.data);
        setFeatures(featuresRes.data as Feature[]);
      })
      .finally(() => setLoading(false));
  }, [projectId, release.bugs?.length, release.id]);

  const linkableBugs = useMemo(
    () => bugs.filter((b) => !b.releaseId || b.releaseId !== release.id),
    [bugs, release.id]
  );

  function toggleBug(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function applyFeatureShortcut(value: string) {
    setFeatureShortcut(value);
    if (!value) return;

    const matching =
      value === '__none__'
        ? linkableBugs.filter((b) => !b.featureId)
        : linkableBugs.filter((b) => b.featureId === value);

    setSelected(new Set(matching.map((b) => b.id)));
  }

  async function handleLink() {
    if (!selected.size) return;
    setLinking(true);
    try {
      await onLink(Array.from(selected));
      setSelected(new Set());
      setFeatureShortcut('');
      if (projectId) {
        const res = await bugsApi.list({ projectId });
        setBugs(res.data);
      }
    } finally {
      setLinking(false);
    }
  }

  if (!projectId) return null;

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="font-display text-xl font-semibold">Link bugs</h2>
      <p className="text-sm text-slate-600">
        Features group bugs; linking adds those bugs to this release.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>Link all bugs from feature</Label>
          <Select value={featureShortcut} onChange={(e) => applyFeatureShortcut(e.target.value)}>
            <option value="">Choose a feature shortcut…</option>
            {features.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
            <option value="__none__">No feature</option>
          </Select>
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            onClick={() => void handleLink()}
            disabled={linking || selected.size === 0}
          >
            {linking ? 'Linking...' : `Link selected (${selected.size})`}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading project bugs...</p>
      ) : linkableBugs.length === 0 ? (
        <p className="text-sm text-slate-500">All project bugs are already linked to this release.</p>
      ) : (
        <ul className="max-h-64 space-y-2 overflow-auto rounded-lg border border-slate-100 p-3">
          {linkableBugs.map((bug) => (
            <li key={bug.id} className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                id={`link-bug-${bug.id}`}
                checked={selected.has(bug.id)}
                onChange={() => toggleBug(bug.id)}
                className="mt-1"
              />
              <label htmlFor={`link-bug-${bug.id}`} className="cursor-pointer">
                <span className="font-mono text-xs text-teal-800">{bug.bugKey}</span>
                <span className="mx-2 text-slate-300">·</span>
                <span className="font-medium text-slate-900">{bug.title}</span>
                {bug.feature?.name && (
                  <span className="ml-2 text-xs text-slate-500">({bug.feature.name})</span>
                )}
                {bug.releaseId && bug.releaseId !== release.id && (
                  <span className="ml-2 text-xs text-amber-600">(linked elsewhere)</span>
                )}
              </label>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
