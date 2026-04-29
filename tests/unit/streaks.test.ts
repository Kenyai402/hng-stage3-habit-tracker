import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

/* MENTOR_TRACE_STAGE3_HABIT_A91 */
describe('calculateCurrentStreak', () => {
  const today = '2024-06-15';
  const yesterday = '2024-06-14';
  const twoDaysAgo = '2024-06-13';
  const threeDaysAgo = '2024-06-12';

  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], today)).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak([yesterday], today)).toBe(0);
    expect(calculateCurrentStreak([twoDaysAgo, yesterday], today)).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    expect(calculateCurrentStreak([today], today)).toBe(1);
    expect(calculateCurrentStreak([yesterday, today], today)).toBe(2);
    expect(calculateCurrentStreak([twoDaysAgo, yesterday, today], today)).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    expect(calculateCurrentStreak([today, today, today], today)).toBe(1);
    expect(calculateCurrentStreak([yesterday, yesterday, today, today], today)).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    // Gap between twoDaysAgo and today (missing yesterday)
    expect(calculateCurrentStreak([twoDaysAgo, today], today)).toBe(1);
    // Gap in a longer sequence
    expect(calculateCurrentStreak([threeDaysAgo, twoDaysAgo, today], today)).toBe(1);
  });
});
