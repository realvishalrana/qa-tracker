'use client';

import { useCallback, useEffect, useState } from 'react';
import { rolesApi, usersApi } from '@/features/users/services/usersApi';
import { useToast } from '@/components/ui/Toast';
import { withMutationToast } from '@/lib/mutationToast';
import type { SystemRole, User } from '@/types';

const DEFAULT_LIMIT = 20;

export function useUsers(q = '', page = 1) {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [meta, setMeta] = useState<{ total?: number; page?: number; limit?: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        usersApi.list({ q: q || undefined, page, limit: DEFAULT_LIMIT }),
        rolesApi.list(),
      ]);
      setUsers(usersRes.data);
      setMeta(usersRes.meta || {});
      setRoles(rolesRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [q, page]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const createUser = useCallback(
    async (body: { email: string; password: string; name: string; roleNames: string[] }) => {
      await withMutationToast(
        toast,
        async () => {
          await usersApi.create(body);
          await reload();
        },
        { success: 'User created' }
      );
    },
    [reload, toast]
  );

  const setActive = useCallback(
    async (id: string, isActive: boolean) => {
      await withMutationToast(
        toast,
        async () => {
          await usersApi.update(id, { isActive });
          await reload();
        },
        { success: isActive ? 'User activated' : 'User deactivated' }
      );
    },
    [reload, toast]
  );

  const updateUserRoles = useCallback(
    async (id: string, roleNames: string[]) => {
      await withMutationToast(
        toast,
        async () => {
          await usersApi.setRoles(id, roleNames);
          await reload();
        },
        { success: 'Roles updated' }
      );
    },
    [reload, toast]
  );

  return {
    users,
    roles,
    meta,
    loading,
    error,
    reload,
    createUser,
    setActive,
    updateUserRoles,
    limit: DEFAULT_LIMIT,
  };
}
