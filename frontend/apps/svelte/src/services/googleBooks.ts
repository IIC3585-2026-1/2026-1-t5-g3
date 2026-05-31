import { services } from './instance'

const { googleBooks } = services

export const searchBooks = googleBooks.searchBooks
export const getBookDetail = googleBooks.getBookDetail
