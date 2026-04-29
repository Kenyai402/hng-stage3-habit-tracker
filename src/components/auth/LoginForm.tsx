'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/storage';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = loginUser(email, password);
    if (result.success) {
      router.replace('/dashboard');
    } else {
      setError(result.error ?? 'Login failed');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div role="alert" className="p-3 rounded text-sm text-white" style={{ backgroundColor: 'var(--danger)' }}>
          {error}
        </div>
      )}
      <div>
        <label htmlFor="login-email" className="block text-sm font-semibold mb-1" style={{ color: 'var(--charcoal)' }}>
          Email
        </label>
        <input
          id="login-email"
          data-testid="auth-login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
          style={{ borderColor: 'var(--warm-gray)' }}
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-semibold mb-1" style={{ color: 'var(--charcoal)' }}>
          Password
        </label>
        <input
          id="login-password"
          data-testid="auth-login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
          style={{ borderColor: 'var(--warm-gray)' }}
        />
      </div>
      <button
        data-testid="auth-login-submit"
        type="submit"
        disabled={loading}
        className="w-full py-3 text-white font-semibold rounded transition-opacity disabled:opacity-60"
        style={{ backgroundColor: 'var(--sage)' }}
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}
