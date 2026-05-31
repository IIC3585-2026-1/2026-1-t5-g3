import { derived, get, writable } from 'svelte/store'
import type { Book, BookStatus, DashboardData, ListType } from '@mybooks/shared'
import { listTypeToStatus, resolveUserBookStatus } from '@mybooks/shared'
import { getErrorMessage } from '@mybooks/shared'
import { isAuthenticated } from './auth'
import * as userBooksService from '../services/userBooks'

const emptyLists: Record<Exclude<ListType, 'dashboard'>, Book[]> = {
  read: [],
  wantToRead: [],
  reading: [],
}

export const lists = writable(emptyLists)
export const activeTab = writable<ListType>('wantToRead')
export const dashboard = writable<DashboardData | null>(null)
export const booksLoading = writable(false)
export const booksError = writable<string | null>(null)

export const activeList = derived(
  [lists, activeTab],
  ([$lists, $activeTab]) => {
    if ($activeTab === 'dashboard') return []
    return $lists[$activeTab]
  },
)

export function findUserBookByExternalId(id: string): Book | undefined {
  return resolveUserBookStatus(id, get(lists))?.book
}

export function getUserBookStatus(id: string): BookStatus | null {
  return resolveUserBookStatus(id, get(lists))?.status ?? null
}

export function setActiveTab(tab: ListType): void {
  activeTab.set(tab)
}

export function clearBooks(): void {
  lists.set({ read: [], wantToRead: [], reading: [] })
  dashboard.set(null)
  booksError.set(null)
  activeTab.set('wantToRead')
}

function populateLists(
  items: Awaited<ReturnType<typeof userBooksService.fetchMyBooks>>,
): void {
  const nextLists: Record<Exclude<ListType, 'dashboard'>, Book[]> = {
    read: [],
    wantToRead: [],
    reading: [],
  }

  for (const item of items) {
    const book = userBooksService.mapUserBook(item)
    if (item.status === 'READ') {
      nextLists.read.push(book)
    } else if (item.status === 'WANT_TO_READ') {
      nextLists.wantToRead.push(book)
    } else if (item.status === 'READING') {
      nextLists.reading.push(book)
    }
  }

  lists.set(nextLists)
}

export async function loadUserBooks(): Promise<void> {
  if (!get(isAuthenticated)) return

  booksLoading.set(true)
  booksError.set(null)

  try {
    const [items, dashboardData] = await Promise.all([
      userBooksService.fetchMyBooks(),
      userBooksService.fetchDashboard(),
    ])

    populateLists(items)
    dashboard.set(dashboardData)
  } catch (error) {
    booksError.set(getErrorMessage(error, 'Error al cargar tus libros'))
  } finally {
    booksLoading.set(false)
  }
}

export async function addBook(
  list: Exclude<ListType, 'dashboard'>,
  book: Book,
): Promise<void> {
  if (!get(isAuthenticated)) {
    throw new Error('AUTH_REQUIRED')
  }

  const status = listTypeToStatus(list)
  await userBooksService.addUserBook(book, status)
  await loadUserBooks()
}

export async function startReading(book: Book): Promise<void> {
  if (!book.userBookId) return

  await userBooksService.updateUserBookStatus(book.userBookId, 'READING', 0)
  await loadUserBooks()
  activeTab.set('reading')
}

export async function markAsRead(book: Book): Promise<void> {
  if (!book.userBookId) return

  await userBooksService.updateUserBookStatus(book.userBookId, 'READ')
  await loadUserBooks()
  activeTab.set('read')
}

export async function updateReadingProgress(
  book: Book,
  currentPage: number,
): Promise<void> {
  if (!book.userBookId) return

  const result = await userBooksService.updateUserBookCurrentPage(
    book.userBookId,
    currentPage,
  )

  await loadUserBooks()

  if (result.status === 'READ') {
    activeTab.set('read')
  } else if (result.status === 'READING') {
    activeTab.set('reading')
  }
}

export async function moveToReading(book: Book): Promise<void> {
  if (!book.userBookId) return

  if (book.pageCount) {
    const page =
      book.currentPage && book.currentPage < book.pageCount
        ? book.currentPage
        : Math.max(0, book.pageCount - 1)
    await userBooksService.updateUserBookCurrentPage(book.userBookId, page)
  } else {
    await userBooksService.updateUserBookStatus(book.userBookId, 'READING', 0)
  }

  await loadUserBooks()
  activeTab.set('reading')
}

export async function moveToWantToRead(book: Book): Promise<void> {
  if (!book.userBookId) return

  await userBooksService.updateUserBookStatus(book.userBookId, 'WANT_TO_READ')
  await loadUserBooks()
  activeTab.set('wantToRead')
}

export async function removeBook(
  list: Exclude<ListType, 'dashboard'>,
  book: Book,
): Promise<void> {
  if (!get(isAuthenticated)) {
    throw new Error('AUTH_REQUIRED')
  }

  if (!book.userBookId) {
    throw new Error('No se pudo identificar el libro en tu biblioteca')
  }

  booksError.set(null)

  try {
    await userBooksService.removeUserBook(book.userBookId)
    const currentLists = get(lists)
    lists.set({
      ...currentLists,
      [list]: currentLists[list].filter(
        (item) => item.userBookId !== book.userBookId,
      ),
    })
    await loadUserBooks()
  } catch (error) {
    booksError.set(getErrorMessage(error, 'No se pudo quitar el libro'))
    throw error
  }
}
