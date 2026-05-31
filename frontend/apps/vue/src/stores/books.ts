import { computed, ref } from 'vue'
import type { Book, BookStatus, DashboardData, ListType } from '@mybooks/shared'
import {
  getErrorMessage,
  listTypeToStatus,
  resolveUserBookStatus,
} from '@mybooks/shared'
import { isAuthenticated } from './auth'
import * as userBooksService from '../services/userBooks'

const emptyLists: Record<Exclude<ListType, 'dashboard'>, Book[]> = {
  read: [],
  wantToRead: [],
  reading: [],
}

export const lists = ref(emptyLists)
export const activeTab = ref<ListType>('wantToRead')
export const dashboard = ref<DashboardData | null>(null)
export const booksLoading = ref(false)
export const booksError = ref<string | null>(null)

export const activeList = computed(() => {
  if (activeTab.value === 'dashboard') return []
  return lists.value[activeTab.value]
})

export function findUserBookByExternalId(id: string): Book | undefined {
  return resolveUserBookStatus(id, lists.value)?.book
}

export function getUserBookStatus(id: string): BookStatus | null {
  return resolveUserBookStatus(id, lists.value)?.status ?? null
}

export function setActiveTab(tab: ListType): void {
  activeTab.value = tab
}

export function clearBooks(): void {
  lists.value = { read: [], wantToRead: [], reading: [] }
  dashboard.value = null
  booksError.value = null
  activeTab.value = 'wantToRead'
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

  lists.value = nextLists
}

export async function loadUserBooks(): Promise<void> {
  if (!isAuthenticated.value) return

  booksLoading.value = true
  booksError.value = null

  try {
    const [items, dashboardData] = await Promise.all([
      userBooksService.fetchMyBooks(),
      userBooksService.fetchDashboard(),
    ])

    populateLists(items)
    dashboard.value = dashboardData
  } catch (error) {
    booksError.value = getErrorMessage(error, 'Error al cargar tus libros')
  } finally {
    booksLoading.value = false
  }
}

export async function addBook(
  list: Exclude<ListType, 'dashboard'>,
  book: Book,
): Promise<void> {
  if (!isAuthenticated.value) {
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
  activeTab.value = 'reading'
}

export async function markAsRead(book: Book): Promise<void> {
  if (!book.userBookId) return

  await userBooksService.updateUserBookStatus(book.userBookId, 'READ')
  await loadUserBooks()
  activeTab.value = 'read'
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
    activeTab.value = 'read'
  } else if (result.status === 'READING') {
    activeTab.value = 'reading'
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
  activeTab.value = 'reading'
}

export async function moveToWantToRead(book: Book): Promise<void> {
  if (!book.userBookId) return

  await userBooksService.updateUserBookStatus(book.userBookId, 'WANT_TO_READ')
  await loadUserBooks()
  activeTab.value = 'wantToRead'
}

export async function removeBook(
  list: Exclude<ListType, 'dashboard'>,
  book: Book,
): Promise<void> {
  if (!isAuthenticated.value) {
    throw new Error('AUTH_REQUIRED')
  }

  if (!book.userBookId) {
    throw new Error('No se pudo identificar el libro en tu biblioteca')
  }

  booksError.value = null

  try {
    await userBooksService.removeUserBook(book.userBookId)
    lists.value = {
      ...lists.value,
      [list]: lists.value[list].filter(
        (item) => item.userBookId !== book.userBookId,
      ),
    }
    await loadUserBooks()
  } catch (error) {
    booksError.value =
      getErrorMessage(error, 'No se pudo quitar el libro')
    throw error
  }
}
