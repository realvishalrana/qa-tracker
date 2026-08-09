'use client';

import { useEffect, useState } from 'react';
import { useUsers } from '@/features/users/hooks/useUsers';
import { CreateUserForm } from '@/features/users/components/CreateUserForm';
import { UsersTable } from '@/features/users/components/UsersTable';
import { Input } from '@/components/ui/Form';
import { Pagination } from '@/components/ui/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

export default function AdminUsersPage() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const debouncedQ = useDebounce(q, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  const { users, roles, meta, loading, error, createUser, setActive, updateUserRoles, limit } =
    useUsers(debouncedQ, page);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Users</h1>
        <p className="mt-1 text-slate-600">
          Create users, activate/deactivate, and assign predefined system roles.
        </p>
      </div>
      <CreateUserForm roles={roles} onCreate={createUser} />
      <Input placeholder="Search users" value={q} onChange={(e) => setQ(e.target.value)} />
      {loading && <p className="text-slate-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && (
        <>
          <UsersTable
            users={users}
            roles={roles}
            onToggleActive={setActive}
            onSaveRoles={updateUserRoles}
          />
          <Pagination
            page={page}
            limit={limit}
            total={meta.total ?? users.length}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
