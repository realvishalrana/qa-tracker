'use client';

import { useState } from 'react';
import type { SystemRole, User } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select } from '@/components/ui/Form';

type UsersTableProps = {
  users: User[];
  roles: SystemRole[];
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  onSaveRoles: (id: string, roleNames: string[]) => Promise<void>;
};

export function UsersTable({ users, roles, onToggleActive, onSaveRoles }: UsersTableProps) {
  const [draftRoles, setDraftRoles] = useState<Record<string, string[]>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  function currentRoles(user: User) {
    return draftRoles[user.id] ?? user.roleNames ?? user.roles?.map((r) => r.name) ?? [];
  }

  function toggleRole(userId: string, roleName: string, selected: string[]) {
    const next = selected.includes(roleName)
      ? selected.filter((n) => n !== roleName)
      : [...selected, roleName];
    setDraftRoles((prev) => ({ ...prev, [userId]: next }));
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">System roles</th>
            <th className="px-4 py-3">Active</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const selected = currentRoles(u);
            return (
              <tr key={u.id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <label key={role.id} className="inline-flex items-center gap-1 text-xs text-slate-700">
                        <input
                          type="checkbox"
                          checked={selected.includes(role.name)}
                          onChange={() => toggleRole(u.id, role.name, selected)}
                        />
                        {role.name}
                      </label>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">{u.isActive ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={savingId === u.id || selected.length === 0}
                      onClick={async () => {
                        setSavingId(u.id);
                        try {
                          await onSaveRoles(u.id, selected);
                        } finally {
                          setSavingId(null);
                        }
                      }}
                    >
                      Save roles
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={savingId === u.id}
                      onClick={async () => {
                        setSavingId(u.id);
                        try {
                          await onToggleActive(u.id, !u.isActive);
                        } finally {
                          setSavingId(null);
                        }
                      }}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
