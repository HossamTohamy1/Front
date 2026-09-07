export function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'م';
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0])
      .join('') || 'م'
  );
}
