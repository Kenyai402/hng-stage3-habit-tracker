'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signupUser } from '@/lib/storage';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = signupUser(email, password);
    if (result.success) {
      router.replace('/dashboard');
    } else {
      setError(result.error ?? 'Signup failed');
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
        <label htmlFor="signup-email" className="block text-sm font-semibold mb-1" style={{ color: 'var(--charcoal)' }}>
          Email
        </label>
        <input
          id="signup-email"
          data-testid="auth-signup-email"
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
        <label htmlFor="signup-password" className="block text-sm font-semibold mb-1" style={{ color: 'var(--charcoal)' }}>
          Password
        </label>
        <input
          id="signup-password"
          data-testid="auth-signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
          style={{ borderColor: 'var(--warm-gray)' }}
        />
      </div>
      <button
        data-testid="auth-signup-submit"
        type="submit"
        disabled={loading}
        className="w-full py-3 text-white font-semibold rounded transition-opacity disabled:opacity-60"
        style={{ backgroundColor: 'var(--sage)' }}
      >
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
}
