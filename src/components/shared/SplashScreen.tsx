'use client';

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: 'var(--sage)', zIndex: 9999 }}
    >
      <div className="text-center text-white">
        <div className="text-6xl mb-4">🌿</div>
        <h1 className="text-4xl font-bold tracking-wide mb-2">Habit Tracker</h1>
        <p className="text-lg opacity-75">Build your best self, one day at a time</p>
      </div>
    </div>
  );
}
