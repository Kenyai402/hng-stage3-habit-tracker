import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🌿</div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--sage-dark)' }}>Habit Tracker</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--warm-gray)' }}>Start your journey</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--charcoal)' }}>Create Account</h2>
          <SignupForm />
          <p className="mt-6 text-center text-sm" style={{ color: 'var(--warm-gray)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold" style={{ color: 'var(--sage)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
