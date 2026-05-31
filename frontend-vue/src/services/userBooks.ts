import type { Book, BookStatus, DashboardData } from '../types/book'
import { deriveCurrentPage } from '../types/book'
import { resolveCoverUrl } from '../utils/bookCover'
import { apiFetch } from './api'

interface UserBookApiResponse {
  id: string
  status: BookStatus
  readAt: string | null
  readingProgress: number
  currentPage: number
  book: {
    id: string
    externalApiId: string
    title: string
    authors: string[]
    thumbnailUrl?: string
    description?: string
    pageCount?: number
  }
}

interface DashboardApiResponse {
  readThisYear: number
  pending: number
  reading: number
  readThisYearBooks: UserBookApiResponse[]
  pendingBooks: UserBookApiResponse[]
  readingBooks: UserBookApiResponse[]
}

function mapUserBook(item: UserBookApiResponse): Book {
  const pageCount = item.book.pageCount
  const currentPage =
    item.currentPage ||
    deriveCurrentPage(item.readingProgress, pageCount)

  return {
    id: item.book.externalApiId,
    userBookId: item.id,
    title: item.book.title,
    authors: item.book.authors,
    thumbnail: resolveCoverUrl(item.book.externalApiId, item.book.thumbnailUrl),
    description: item.book.description,
    pageCount,
    readAt: item.readAt ?? undefined,
    readingProgress: item.readingProgress,
    currentPage,
  }
}

function mapDashboard(data: DashboardApiResponse): DashboardData {
  return {
    readThisYear: data.readThisYear,
    pending: data.pending,
    reading: data.reading,
    readThisYearBooks: data.readThisYearBooks.map(mapUserBook),
    pendingBooks: data.pendingBooks.map(mapUserBook),
    readingBooks: data.readingBooks.map(mapUserBook),
  }
}

export function fetchMyBooks(): Promise<UserBookApiResponse[]> {
  return apiFetch<UserBookApiResponse[]>('/user-books/me')
}

export function fetchDashboard(): Promise<DashboardData> {
  return apiFetch<DashboardApiResponse>('/user-books/dashboard').then(mapDashboard)
}

export function addUserBook(
  book: Book,
  status: BookStatus,
): Promise<UserBookApiResponse> {
  return apiFetch<UserBookApiResponse>('/user-books', {
    method: 'POST',
    body: JSON.stringify({
      externalApiId: book.id,
      title: book.title,
      authors: book.authors,
      thumbnail: book.thumbnail,
      description: book.description,
      pageCount: book.pageCount,
      status,
    }),
  })
}

export function updateUserBookStatus(
  userBookId: string,
  status: BookStatus,
  readingProgress?: number,
): Promise<UserBookApiResponse> {
  return apiFetch<UserBookApiResponse>(`/user-books/${userBookId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, readingProgress }),
  })
}

export function updateUserBookCurrentPage(
  userBookId: string,
  currentPage: number,
): Promise<UserBookApiResponse> {
  return apiFetch<UserBookApiResponse>(`/user-books/${userBookId}/progress`, {
    method: 'PATCH',
    body: JSON.stringify({ currentPage }),
  })
}

export function removeUserBook(userBookId: string): Promise<void> {
  return apiFetch<void>(`/user-books/${userBookId}`, {
    method: 'DELETE',
  })
}

export { mapUserBook }
