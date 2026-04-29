export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayStr = today ?? new Date().toISOString().split('T')[0];

  // Remove duplicates and sort
  const unique = Array.from(new Set(completions)).sort();

  if (!unique.includes(todayStr)) return 0;

  let streak = 1;
  let current = new Date(todayStr);

  while (true) {
    current.setDate(current.getDate() - 1);
    const prev = current.toISOString().split('T')[0];
    if (unique.includes(prev)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
