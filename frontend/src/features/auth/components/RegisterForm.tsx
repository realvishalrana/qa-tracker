'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Form';
import { useRegister } from '@/features/auth/hooks/useRegister';

export function RegisterForm() {
  const { name, setName, email, setEmail, password, setPassword, error, loading, submit } =
    useRegister();

  return (
    <>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating...' : 'Register'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-teal-700 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
