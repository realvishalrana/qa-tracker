'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProjectDetail } from '@/features/projects/hooks/useProjectDetail';
import {
  CreateBugForm,
  FeaturePanel,
  MembersPanel,
} from '@/features/projects/components/ProjectDetail';
import { BugList } from '@/features/bugs/components/BugList';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Form';
import { Tabs } from '@/components/ui/Tabs';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Form';
import { useAuth } from '@/providers/AuthProvider';
import { PERMISSIONS } from '@/types';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { hasPermission } = useAuth();
  const {
    project,
    features,
    bugs,
    releases,
    members,
    directory,
    loading,
    error,
    addFeature,
    createBug,
    createRelease,
    addMember,
    updateMemberRole,
    loadDirectory,
    emptyBugForm,
  } = useProjectDetail(params.id);
  const [tab, setTab] = useState('overview');
  const [featureName, setFeatureName] = useState('');
  const [bugForm, setBugForm] = useState(emptyBugForm);
  const [featureError, setFeatureError] = useState<string | null>(null);
  const [showBugModal, setShowBugModal] = useState(false);

  if (error) return <p className="text-red-600">{error}</p>;
  if (loading || !project) return <p className="text-slate-500">Loading project...</p>;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'bugs', label: 'Bugs', count: bugs.length },
    { id: 'releases', label: 'Releases', count: releases.length },
    { id: 'team', label: 'Team', count: members.length },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Badge className="mb-2 bg-teal-100 text-teal-800">{project.key}</Badge>
        <h1 className="font-display text-3xl font-semibold text-slate-900">{project.name}</h1>
        {project.description && <p className="mt-2 text-slate-600">{project.description}</p>}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <StatCard label="Bugs" value={bugs.length} />
          <StatCard label="Features" value={features.length} />
          <StatCard label="Members" value={members.length} />
        </div>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Recent bugs</h2>
            <div className="mt-3">
              <BugList bugs={bugs.slice(0, 5)} />
            </div>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Recent releases</h2>
            <ul className="mt-3 space-y-2">
              {releases.slice(0, 5).map((r) => (
                <li key={r.id}>
                  <Link href={`/releases/${r.id}`} className="text-teal-700 hover:underline">
                    {r.name} ({r.version})
                  </Link>
                  <span className="ml-2 text-sm text-slate-500">{r.status}</span>
                </li>
              ))}
              {!releases.length && <li className="text-sm text-slate-500">No releases yet.</li>}
            </ul>
          </section>
        </div>
      )}

      {tab === 'bugs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            {hasPermission(PERMISSIONS.BUG_CREATE) && (
              <Button onClick={() => setShowBugModal(true)}>Report bug</Button>
            )}
          </div>
          <BugList bugs={bugs} />
        </div>
      )}

      {tab === 'releases' && (
        <div className="space-y-4">
          <ul className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {releases.map((r) => (
              <li key={r.id} className="flex items-center justify-between text-sm">
                <Link href={`/releases/${r.id}`} className="font-medium text-teal-800 hover:underline">
                  {r.name} ({r.version})
                </Link>
                <span className="text-slate-500">{r.status}</span>
              </li>
            ))}
            {!releases.length && <li className="text-sm text-slate-500">No releases yet.</li>}
          </ul>
          {hasPermission(PERMISSIONS.RELEASE_MANAGE) && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);
                await createRelease({
                  name: String(fd.get('name') || ''),
                  version: String(fd.get('version') || ''),
                  notes: String(fd.get('notes') || ''),
                });
                form.reset();
              }}
              className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3"
            >
              <Input name="name" placeholder="Release name" required />
              <Input name="version" placeholder="1.0.0" required />
              <Button type="submit">Create release</Button>
            </form>
          )}
        </div>
      )}

      {tab === 'team' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <MembersPanel
            members={members}
            canManage={hasPermission(PERMISSIONS.PROJECT_MEMBERS_MANAGE)}
            directory={directory}
            onLoadDirectory={loadDirectory}
            onAdd={addMember}
            onUpdateRole={updateMemberRole}
          />
          <div className="space-y-2">
            <FeaturePanel
              features={features}
              canAdd={hasPermission(PERMISSIONS.FEATURE_CREATE)}
              featureName={featureName}
              onFeatureNameChange={setFeatureName}
              onAddFeature={async (e) => {
                e.preventDefault();
                setFeatureError(null);
                try {
                  await addFeature(featureName);
                  setFeatureName('');
                } catch (err) {
                  setFeatureError(err instanceof Error ? err.message : 'Failed to add feature');
                }
              }}
            />
            {featureError && <p className="text-sm text-red-600">{featureError}</p>}
          </div>
        </div>
      )}

      {showBugModal && hasPermission(PERMISSIONS.BUG_CREATE) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Report bug</h2>
              <button
                type="button"
                className="text-slate-500 hover:text-slate-700"
                onClick={() => setShowBugModal(false)}
              >
                ✕
              </button>
            </div>
            <CreateBugForm
              form={bugForm}
              features={features}
              onChange={setBugForm}
              onSubmit={async (form) => {
                await createBug(form);
                setBugForm(emptyBugForm);
                setShowBugModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
