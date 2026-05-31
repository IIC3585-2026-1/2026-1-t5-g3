import { computed, ref } from 'vue'
import type { Book, ListType } from '../types/book'

const emptyLists: Record<ListType, Book[]> = {
  read: [],
  recommended: [],
  wantToRead: [],
}

export const lists = ref<Record<ListType, Book[]>>(emptyLists)
export const activeTab = ref<ListType>('wantToRead')

export const activeList = computed(() => lists.value[activeTab.value])

export function setActiveTab(tab: ListType): void {
  activeTab.value = tab
}

export function addBook(list: ListType, book: Book): void {
  const alreadyExists = lists.value[list].some((item) => item.id === book.id)
  if (alreadyExists) return

  lists.value = {
    ...lists.value,
    [list]: [...lists.value[list], book],
  }
}

export function removeBook(list: ListType, bookId: string): void {
  lists.value = {
    ...lists.value,
    [list]: lists.value[list].filter((book) => book.id !== bookId),
  }
}
