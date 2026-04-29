'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';

type HabitCardProps = {
  habit: Habit;
  today: string;
  onToggle: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
};

export default function HabitCard({ habit, today, onToggle, onEdit, onDelete }: HabitCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const isCompleted = habit.completions.includes(today);

  const handleDelete = () => {
    if (confirmingDelete) {
      onDelete(habit.id);
    } else {
      setConfirmingDelete(true);
    }
  };

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className="bg-white rounded-2xl shadow-sm p-5 border-l-4"
      style={{ borderLeftColor: isCompleted ? 'var(--sage)' : 'var(--warm-gray)' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg leading-tight" style={{ color: 'var(--charcoal)' }}>
            {habit.name}
          </h3>
          {habit.description && (
            <p className="mt-1 text-sm" style={{ color: 'var(--warm-gray)' }}>{habit.description}</p>
          )}
          <div
            data-testid={`habit-streak-${slug}`}
            className="mt-2 flex items-center gap-1 text-sm font-medium"
            style={{ color: streak > 0 ? 'var(--gold)' : 'var(--warm-gray)' }}
          >
            <span>🔥</span>
            <span>{streak} day{streak !== 1 ? 's' : ''} streak</span>
          </div>
        </div>

        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit.id)}
          aria-label={isCompleted ? `Unmark ${habit.name} as complete` : `Mark ${habit.name} as complete`}
          aria-pressed={isCompleted}
          className="flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors focus-visible:outline-2"
          style={{
            borderColor: isCompleted ? 'var(--sage)' : 'var(--warm-gray)',
            backgroundColor: isCompleted ? 'var(--sage)' : 'transparent',
            color: isCompleted ? 'white' : 'var(--warm-gray)',
          }}
        >
          {isCompleted ? '✓' : '○'}
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="px-3 py-1 text-sm rounded border font-medium focus-visible:outline-2"
          style={{ borderColor: 'var(--sage)', color: 'var(--sage)' }}
        >
          Edit
        </button>

        {confirmingDelete ? (
          <div className="flex gap-2 items-center">
            <span className="text-sm" style={{ color: 'var(--danger)' }}>Are you sure?</span>
            <button
              data-testid="confirm-delete-button"
              onClick={handleDelete}
              className="px-3 py-1 text-sm rounded text-white font-medium"
              style={{ backgroundColor: 'var(--danger)' }}
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="px-3 py-1 text-sm rounded border font-medium"
              style={{ borderColor: 'var(--warm-gray)', color: 'var(--warm-gray)' }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={handleDelete}
            className="px-3 py-1 text-sm rounded border font-medium focus-visible:outline-2"
            style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
