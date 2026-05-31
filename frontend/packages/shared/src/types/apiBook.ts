import { resolveCoverUrl } from '../utils/bookCover'

export interface ApiBook {
  id: string
  externalApiId: string
  title: string
  authors: string[]
  thumbnailUrl?: string
  description?: string
  pageCount?: number
}

export function mapApiBookCover(book: ApiBook): ApiBook {
  return {
    ...book,
    thumbnailUrl: resolveCoverUrl(book.externalApiId, book.thumbnailUrl),
  }
}
