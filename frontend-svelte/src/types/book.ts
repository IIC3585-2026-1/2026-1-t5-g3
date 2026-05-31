export type ListType = 'wantToRead' | 'reading' | 'read' | 'dashboard'

export type BookStatus = 'WANT_TO_READ' | 'READING' | 'READ'

export interface Book {
  id: string
  userBookId?: string
  title: string
  authors: string[]
  thumbnail?: string
  description?: string
  readAt?: string
  readingProgress?: number
  currentPage?: number
  pageCount?: number
  publishedDate?: string
}

export interface BookDetail extends Book {
  subtitle?: string
  publisher?: string
  pageCount?: number
  printedPageCount?: number
  categories?: string[]
  language?: string
  averageRating?: number
  ratingsCount?: number
  previewLink?: string
  infoLink?: string
  canonicalLink?: string
  isbn10?: string
  isbn13?: string
  coverUrl?: string
  maturityRating?: string
}

export interface DashboardData {
  readThisYear: number
  pending: number
  reading: number
  readThisYearBooks: Book[]
  pendingBooks: Book[]
  readingBooks: Book[]
}

export const LIST_LABELS: Record<ListType, string> = {
  wantToRead: 'Quiero leer',
  reading: 'Leyendo',
  read: 'Leídos',
  dashboard: 'Dashboard',
}

export const STATUS_LABELS: Record<BookStatus, string> = {
  WANT_TO_READ: 'Guardado',
  READING: 'En progreso',
  READ: 'Leído',
}

export function resolveUserBookStatus(
  bookId: string,
  userLists: Record<Exclude<ListType, 'dashboard'>, Book[]>,
): { status: BookStatus; book: Book } | null {
  const checks: Array<[Exclude<ListType, 'dashboard'>, BookStatus]> = [
    ['read', 'READ'],
    ['reading', 'READING'],
    ['wantToRead', 'WANT_TO_READ'],
  ]

  for (const [listKey, status] of checks) {
    const book = userLists[listKey].find((item) => item.id === bookId)
    if (book) return { status, book }
  }

  return null
}

export function listTypeToStatus(
  list: Exclude<ListType, 'dashboard'>,
): BookStatus {
  if (list === 'read') return 'READ'
  if (list === 'reading') return 'READING'
  return 'WANT_TO_READ'
}

export function formatPublishedYear(publishedDate?: string): string | null {
  if (!publishedDate) return null
  const year = publishedDate.slice(0, 4)
  return /^\d{4}$/.test(year) ? year : publishedDate
}

export function calculateReadingProgress(
  currentPage: number,
  pageCount?: number,
): number {
  if (!pageCount || pageCount <= 0) return 0
  const clampedPage = Math.min(Math.max(0, currentPage), pageCount)
  return Math.round((clampedPage / pageCount) * 100)
}

export function deriveCurrentPage(
  readingProgress: number,
  pageCount?: number,
): number {
  if (!pageCount || pageCount <= 0) return 0
  return Math.round((readingProgress / 100) * pageCount)
}
