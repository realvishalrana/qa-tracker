'use client';

import { useEffect, useState } from 'react';
import type { ProjectRole, User } from '@/types';
import type { ProjectMember } from '@/features/projects/hooks/useProjectDetail';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Form';
import { PROJECT_ROLES } from '@/types';

type MembersProps = {
  members: ProjectMember[];
  canManage: boolean;
  directory: User[];
  onLoadDirectory: () => void;
  onAdd: (userId: string, projectRole: ProjectRole) => Promise<void>;
  onUpdateRole: (userId: string, projectRole: ProjectRole) => Promise<void>;
};

export function MembersPanel({
  members,
  canManage,
  directory,
  onLoadDirectory,
  onAdd,
  onUpdateRole,
}: MembersProps) {
  const [userId, setUserId] = useState('');
  const [projectRole, setProjectRole] = useState<ProjectRole>('MEMBER');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (canManage) onLoadDirectory();
  }, [canManage, onLoadDirectory]);

  const memberIds = new Set(members.map((m) => m.user.id));
  const candidates = directory.filter((u) => !memberIds.has(u.id) && u.isActive !== false);

  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-semibold">Members</h2>
      <ul className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        {members.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span>{m.user.name}</span>
            {canManage ? (
              <Select
                className="w-auto"
                value={m.projectRole}
                onChange={(e) => void onUpdateRole(m.user.id, e.target.value as ProjectRole)}
              >
                {PROJECT_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            ) : (
              <span className="text-slate-500">{m.projectRole}</span>
            )}
          </li>
        ))}
        {!members.length && <li className="text-sm text-slate-500">No members yet.</li>}
      </ul>
      {canManage && (
        <form
          className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_auto_auto]"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!userId) return;
            setSaving(true);
            setError(null);
            try {
              await onAdd(userId, projectRole);
              setUserId('');
              setProjectRole('MEMBER');
              onLoadDirectory();
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to add member');
            } finally {
              setSaving(false);
            }
          }}
        >
          <Select value={userId} onChange={(e) => setUserId(e.target.value)} required>
            <option value="">Select user</option>
            {candidates.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </Select>
          <Select
            value={projectRole}
            onChange={(e) => setProjectRole(e.target.value as ProjectRole)}
          >
            {PROJECT_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
          <Button type="submit" disabled={saving || !userId}>
            Add
          </Button>
          {error && <p className="text-sm text-red-600 sm:col-span-3">{error}</p>}
        </form>
      )}
    </div>
  );
}
