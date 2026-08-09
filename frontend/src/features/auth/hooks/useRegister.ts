'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { ApiError } from '@/lib/apiClient';
import { formatZodError, registerSchema } from '@/lib/validation';

export function useRegister() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const parsed = registerSchema.safeParse({ name, email, password });
      if (!parsed.success) {
        setError(formatZodError(parsed.error));
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await register(parsed.data);
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Registration failed');
      } finally {
        setLoading(false);
      }
    },
    [register, router, name, email, password]
  );

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    submit,
  };
}
