import { services } from './instance'

const { userBooks } = services

export const mapUserBook = userBooks.mapUserBook
export const fetchMyBooks = userBooks.fetchMyBooks
export const fetchDashboard = userBooks.fetchDashboard
export const addUserBook = userBooks.addUserBook
export const updateUserBookStatus = userBooks.updateUserBookStatus
export const updateUserBookCurrentPage = userBooks.updateUserBookCurrentPage
export const removeUserBook = userBooks.removeUserBook
