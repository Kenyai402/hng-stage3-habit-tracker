'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { validateHabitName } from '@/lib/validators';

type HabitFormProps = {
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
  initial?: Pick<Habit, 'name' | 'description'>;
};

export default function HabitForm({ onSave, onCancel, initial }: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHabitName(name);
    if (!validation.valid) {
      setNameError(validation.error);
      return;
    }
    onSave(validation.value, description.trim());
  };

  return (
    <form data-testid="habit-form" onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl shadow-sm p-6">
      <div>
        <label htmlFor="habit-name" className="block text-sm font-semibold mb-1" style={{ color: 'var(--charcoal)' }}>
          Habit Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setNameError(null); }}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
          style={{ borderColor: nameError ? 'var(--danger)' : 'var(--warm-gray)' }}
          aria-describedby={nameError ? 'name-error' : undefined}
        />
        {nameError && (
          <p id="name-error" role="alert" className="mt-1 text-sm" style={{ color: 'var(--danger)' }}>
            {nameError}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="habit-description" className="block text-sm font-semibold mb-1" style={{ color: 'var(--charcoal)' }}>
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 resize-none"
          style={{ borderColor: 'var(--warm-gray)' }}
        />
      </div>
      <div>
        <label htmlFor="habit-frequency" className="block text-sm font-semibold mb-1" style={{ color: 'var(--charcoal)' }}>
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          defaultValue="daily"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
          style={{ borderColor: 'var(--warm-gray)' }}
        >
          <option value="daily">Daily</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          data-testid="habit-save-button"
          type="submit"
          className="flex-1 py-2 text-white font-semibold rounded"
          style={{ backgroundColor: 'var(--sage)' }}
        >
          Save Habit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 font-semibold rounded border"
          style={{ borderColor: 'var(--warm-gray)', color: 'var(--warm-gray)' }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
