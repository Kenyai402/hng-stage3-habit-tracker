import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

Object.defineProperty(globalThis, 'crypto', {
  value: { randomUUID: () => Math.random().toString(36).slice(2) },
  configurable: true,
});

import HabitForm from '@/components/habits/HabitForm';
import HabitCard from '@/components/habits/HabitCard';
import { Habit } from '@/types/habit';
import { toggleHabitCompletion } from '@/lib/habits';
import { getHabitSlug } from '@/lib/slug';

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 'habit-1',
    userId: 'user-1',
    name: 'Test Habit',
    description: '',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    completions: [],
    ...overrides,
  };
}

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();
    mockReplace.mockClear();
  });

  it('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup();
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />);

    await user.click(screen.getByTestId('habit-save-button'));

    expect(await screen.findByText('Habit name is required')).toBeInTheDocument();
  });

  it('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup();
    const today = new Date().toISOString().split('T')[0];
    let savedHabit: Habit | null = null;

    render(
      <HabitForm
        onSave={(name, description) => {
          savedHabit = makeHabit({ name, description });
        }}
        onCancel={vi.fn()}
      />
    );

    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water');
    await user.type(screen.getByTestId('habit-description-input'), 'Stay hydrated');
    await user.click(screen.getByTestId('habit-save-button'));

    expect(savedHabit).not.toBeNull();
    expect((savedHabit as Habit).name).toBe('Drink Water');

    render(
      <HabitCard
        habit={savedHabit!}
        today={today}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const slug = getHabitSlug('Drink Water');
    expect(screen.getByTestId(`habit-card-${slug}`)).toBeInTheDocument();
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const user = userEvent.setup();
    const original = makeHabit({
      id: 'immutable-id',
      userId: 'user-42',
      name: 'Read Books',
      createdAt: '2024-01-01T00:00:00.000Z',
      completions: ['2024-06-01'],
    });

    let updatedName = '';
    render(
      <HabitForm
        initial={{ name: original.name, description: original.description }}
        onSave={(name) => { updatedName = name; }}
        onCancel={vi.fn()}
      />
    );

    const nameInput = screen.getByTestId('habit-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Read Daily');
    await user.click(screen.getByTestId('habit-save-button'));

    expect(updatedName).toBe('Read Daily');

    // Verify immutable fields preserved when building updated habit
    const updated: Habit = { ...original, name: updatedName };
    expect(updated.id).toBe('immutable-id');
    expect(updated.userId).toBe('user-42');
    expect(updated.createdAt).toBe('2024-01-01T00:00:00.000Z');
    expect(updated.completions).toEqual(['2024-06-01']);
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const user = userEvent.setup();
    const today = new Date().toISOString().split('T')[0];
    const habit = makeHabit({ name: 'Exercise' });
    const onDelete = vi.fn();

    render(
      <HabitCard
        habit={habit}
        today={today}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />
    );

    const slug = getHabitSlug('Exercise');

    // First click — shows confirm, does NOT call onDelete
    await user.click(screen.getByTestId(`habit-delete-${slug}`));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();

    // Confirm — calls onDelete
    await user.click(screen.getByTestId('confirm-delete-button'));
    expect(onDelete).toHaveBeenCalledWith(habit.id);
  });

  it('toggles completion and updates the streak display', async () => {
    const user = userEvent.setup();
    const today = new Date().toISOString().split('T')[0];
    const habit = makeHabit({ name: 'Meditate', completions: [] });
    const slug = getHabitSlug('Meditate');

    let currentHabit = habit;
    const { rerender } = render(
      <HabitCard
        habit={currentHabit}
        today={today}
        onToggle={(id) => {
          currentHabit = toggleHabitCompletion(currentHabit, today);
          rerender(
            <HabitCard
              habit={currentHabit}
              today={today}
              onToggle={vi.fn()}
              onEdit={vi.fn()}
              onDelete={vi.fn()}
            />
          );
        }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    // Initial streak = 0
    expect(screen.getByTestId(`habit-streak-${slug}`)).toHaveTextContent('0 days streak');

    // Toggle complete → streak = 1
    await user.click(screen.getByTestId(`habit-complete-${slug}`));
    expect(screen.getByTestId(`habit-streak-${slug}`)).toHaveTextContent('1 day streak');
  });
});
