'use client';

import { useCallback, useEffect, useState } from 'react';
import { bugsApi } from '@/features/bugs/services/bugsApi';
import { projectsApi } from '@/features/projects/services/projectsApi';
import { useToast } from '@/components/ui/Toast';
import { withMutationToast } from '@/lib/mutationToast';
import { Button } from '@/components/ui/Button';
import { Label, Select } from '@/components/ui/Form';
import type { Bug } from '@/types';

type Member = { user: { id: string; name: string } };

type Props = {
  bug: Bug;
  onSaved: () => Promise<void>;
};

export function BugAssignForm({ bug, onSaved }: Props) {
  const toast = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [assigneeId, setAssigneeId] = useState(bug.assigneeId || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAssigneeId(bug.assigneeId || '');
  }, [bug.assigneeId]);

  useEffect(() => {
    if (!bug.projectId) return;
    void projectsApi.members(bug.projectId).then((res) => setMembers(res.data as Member[]));
  }, [bug.projectId]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      await withMutationToast(
        toast,
        async () => {
          await bugsApi.assign(bug.id, assigneeId || null);
          await onSaved();
        },
        { success: 'Assignee updated' }
      );
    } finally {
      setSaving(false);
    }
  }, [assigneeId, bug.id, onSaved, toast]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="font-display text-lg font-semibold">Assignee</h2>
      <div>
        <Label>Team member</Label>
        <Select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m.user.id} value={m.user.id}>
              {m.user.name}
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? 'Saving…' : 'Save assignee'}
      </Button>
    </form>
  );
}
