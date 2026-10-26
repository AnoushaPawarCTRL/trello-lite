
function parseDate(deadline: string): Date {
  const [year, month, day] = deadline.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDeadline(deadline: string): string {
  return parseDate(deadline).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function isOverdue(deadline: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseDate(deadline) < today;
}