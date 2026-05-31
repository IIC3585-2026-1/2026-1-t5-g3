export function formatStars(rating: number, total = 5): string {
  const clamped = Math.min(Math.max(0, rating), total)
  return '★'.repeat(clamped) + '☆'.repeat(total - clamped)
}
