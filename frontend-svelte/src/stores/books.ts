import { derived, writable } from 'svelte/store';
import type { Book, ListType } from '../types/book';

const emptyLists: Record<ListType, Book[]> = {
  read: [],
  recommended: [],
  wantToRead: [],
};

export const lists = writable<Record<ListType, Book[]>>(emptyLists);
export const activeTab = writable<ListType>('wantToRead');

export const activeList = derived(
  [lists, activeTab],
  ([$lists, $activeTab]) => $lists[$activeTab],
);

export function setActiveTab(tab: ListType): void {
  activeTab.set(tab);
}

export function addBook(list: ListType, book: Book): void {
  lists.update((current) => {
    const alreadyExists = current[list].some((item) => item.id === book.id);
    if (alreadyExists) return current;

    return {
      ...current,
      [list]: [...current[list], book],
    };
  });
}

export function removeBook(list: ListType, bookId: string): void {
  lists.update((current) => ({
    ...current,
    [list]: current[list].filter((book) => book.id !== bookId),
  }));
}
