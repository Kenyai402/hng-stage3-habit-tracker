'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Habit } from '@/types/habit';
import { Session } from '@/types/auth';
import { getSession, clearSession, getUserHabits, getHabits, saveHabits } from '@/lib/storage';
import { toggleHabitCompletion } from '@/lib/habits';
import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';

export default function DashboardClient() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace('/login');
      return;
    }
    setSession(s);
    setHabits(getUserHabits(s.userId));
  }, [router]);

  const refreshHabits = (userId: string) => {
    setHabits(getUserHabits(userId));
  };

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  const handleCreate = (name: string, description: string) => {
    if (!session) return;
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name,
      description,
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    };
    const all = getHabits();
    saveHabits([...all, newHabit]);
    refreshHabits(session.userId);
    setShowCreate(false);
  };

  const handleEdit = (name: string, description: string) => {
    if (!session || !editingHabit) return;
    const all = getHabits();
    const updated = all.map((h) =>
      h.id === editingHabit.id
        ? { ...h, name, description }
        : h
    );
    saveHabits(updated);
    refreshHabits(session.userId);
    setEditingHabit(null);
  };

  const handleDelete = (id: string) => {
    if (!session) return;
    const all = getHabits();
    saveHabits(all.filter((h) => h.id !== id));
    refreshHabits(session.userId);
  };

  const handleToggle = (id: string) => {
    if (!session) return;
    const all = getHabits();
    const updated = all.map((h) =>
      h.id === id ? toggleHabitCompletion(h, today) : h
    );
    saveHabits(updated);
    refreshHabits(session.userId);
  };

  if (!session) return null;

  return (
    <div data-testid="dashboard-page" className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <h1 className="text-xl font-bold" style={{ color: 'var(--sage-dark)' }}>Habit Tracker</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block" style={{ color: 'var(--warm-gray)' }}>
              {session.email}
            </span>
            <button
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="px-3 py-1 text-sm border rounded font-medium"
              style={{ borderColor: 'var(--warm-gray)', color: 'var(--warm-gray)' }}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--charcoal)' }}>Your Habits</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--warm-gray)' }}>
              {today}
            </p>
          </div>
          {!showCreate && !editingHabit && (
            <button
              data-testid="create-habit-button"
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 text-sm text-white font-semibold rounded-full"
              style={{ backgroundColor: 'var(--sage)' }}
            >
              + New Habit
            </button>
          )}
        </div>

        {showCreate && (
          <HabitForm
            onSave={handleCreate}
            onCancel={() => setShowCreate(false)}
          />
        )}

        {editingHabit && (
          <HabitForm
            initial={{ name: editingHabit.name, description: editingHabit.description }}
            onSave={handleEdit}
            onCancel={() => setEditingHabit(null)}
          />
        )}

        {habits.length === 0 && !showCreate ? (
          <div
            data-testid="empty-state"
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--charcoal)' }}>
              No habits yet
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--warm-gray)' }}>
              Start building your best self by creating your first habit.
            </p>
            <button
              data-testid="create-habit-button"
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 text-white font-semibold rounded-full"
              style={{ backgroundColor: 'var(--sage)' }}
            >
              Create First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                today={today}
                onToggle={handleToggle}
                onEdit={(h) => { setShowCreate(false); setEditingHabit(h); }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
