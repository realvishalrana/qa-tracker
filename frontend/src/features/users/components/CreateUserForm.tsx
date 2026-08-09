'use client';

import { useState } from 'react';
import type { SystemRole } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select } from '@/components/ui/Form';
import { PasswordInput } from '@/components/ui/PasswordInput';

type CreateUserProps = {
  roles: SystemRole[];
  onCreate: (body: {
    name: string;
    email: string;
    password: string;
    roleNames: string[];
  }) => Promise<void>;
};

export function CreateUserForm({ roles, onCreate }: CreateUserProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleNames, setRoleNames] = useState<string[]>(['Developer']);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
          await onCreate({ name, email, password, roleNames });
          setName('');
          setEmail('');
          setPassword('');
          setRoleNames(['Developer']);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to create user');
        } finally {
          setSaving(false);
        }
      }}
    >
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Primary role preset</Label>
        <Select
          value={roleNames[0] || 'Developer'}
          onChange={(e) => setRoleNames([e.target.value])}
        >
          {roles.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </Select>
        <p className="mt-1 text-xs text-slate-500">You can add more roles after create.</p>
      </div>
      {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
      <div className="md:col-span-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create user'}
        </Button>
      </div>
    </form>
  );
}
