import { createServices } from '@mybooks/shared'
import { token } from '../stores/auth'

export const services = createServices({
  getToken: () => token.value,
  apiUrl: import.meta.env.VITE_API_URL,
  googleBooksApiKey: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY,
})
