import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import { Habit } from '@/types/habit';

const makeHabit = (completions: string[] = []): Habit => ({
  id: 'test-id',
  userId: 'user-1',
  name: 'Test Habit',
  description: '',
  frequency: 'daily',
  createdAt: '2024-01-01T00:00:00.000Z',
  completions,
});

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    const habit = makeHabit([]);
    const result = toggleHabitCompletion(habit, '2024-06-15');
    expect(result.completions).toContain('2024-06-15');
    expect(result.completions).toHaveLength(1);
  });

  it('removes a completion date when the date already exists', () => {
    const habit = makeHabit(['2024-06-15', '2024-06-14']);
    const result = toggleHabitCompletion(habit, '2024-06-15');
    expect(result.completions).not.toContain('2024-06-15');
    expect(result.completions).toContain('2024-06-14');
  });

  it('does not mutate the original habit object', () => {
    const completions = ['2024-06-14'];
    const habit = makeHabit(completions);
    toggleHabitCompletion(habit, '2024-06-15');
    expect(habit.completions).toEqual(['2024-06-14']);
    expect(habit.completions).toHaveLength(1);
  });

  it('does not return duplicate completion dates', () => {
    const habit = makeHabit(['2024-06-15', '2024-06-15']);
    const result = toggleHabitCompletion(habit, '2024-06-16');
    const counts = result.completions.filter((d) => d === '2024-06-15').length;
    expect(counts).toBe(1);
  });
});
