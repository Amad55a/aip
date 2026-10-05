export function calculateProgress(completed: number, total: number) {
  const safeTotal = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
  const safeCompleted = Number.isFinite(completed)
    ? Math.min(safeTotal, Math.max(0, Math.floor(completed)))
    : 0;

  return {
    completed: safeCompleted,
    total: safeTotal,
    percent: safeTotal ? Math.round((safeCompleted / safeTotal) * 100) : 0,
  };
}
