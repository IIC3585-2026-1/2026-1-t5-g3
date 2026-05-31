import type { Book, BookDetail } from '../types/book'
import { resolveCoverUrl } from '../utils/bookCover'

interface GoogleIndustryIdentifier {
  type?: string
  identifier?: string
}

interface GoogleVolumeInfo {
  title?: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  pageCount?: number
  printedPageCount?: number
  categories?: string[]
  averageRating?: number
  ratingsCount?: number
  maturityRating?: string
  language?: string
  previewLink?: string
  infoLink?: string
  canonicalVolumeLink?: string
  industryIdentifiers?: GoogleIndustryIdentifier[]
  imageLinks?: {
    smallThumbnail?: string
    thumbnail?: string
    small?: string
    medium?: string
    large?: string
    extraLarge?: string
  }
}

interface GoogleVolume {
  id: string
  volumeInfo?: GoogleVolumeInfo
}

interface GoogleBooksResponse {
  items?: GoogleVolume[]
}

function pickCoverUrl(
  volumeId: string,
  imageLinks?: GoogleVolumeInfo['imageLinks'],
  size: 'thumb' | 'large' = 'thumb',
): string {
  const candidates =
    size === 'large'
      ? [
          imageLinks?.extraLarge,
          imageLinks?.large,
          imageLinks?.medium,
          imageLinks?.small,
          imageLinks?.thumbnail,
          imageLinks?.smallThumbnail,
        ]
      : [
          imageLinks?.thumbnail,
          imageLinks?.smallThumbnail,
          imageLinks?.small,
          imageLinks?.medium,
        ]

  const firstAvailable = candidates.find(Boolean)
  return resolveCoverUrl(volumeId, firstAvailable, size)
}

function pickIsbn(identifiers?: GoogleIndustryIdentifier[]): {
  isbn10?: string
  isbn13?: string
} {
  const isbn10 = identifiers?.find((item) => item.type === 'ISBN_10')?.identifier
  const isbn13 = identifiers?.find((item) => item.type === 'ISBN_13')?.identifier
  return { isbn10, isbn13 }
}

function mapVolumeToBook(volume: GoogleVolume): Book {
  const info = volume.volumeInfo ?? {}
  return {
    id: volume.id,
    title: info.title ?? 'Sin título',
    authors: info.authors ?? ['Autor desconocido'],
    thumbnail: pickCoverUrl(volume.id, info.imageLinks, 'thumb'),
    description: info.description,
    publishedDate: info.publishedDate,
    pageCount: info.pageCount,
  }
}

function mapVolumeToDetail(volume: GoogleVolume): BookDetail {
  const info = volume.volumeInfo ?? {}
  const { isbn10, isbn13 } = pickIsbn(info.industryIdentifiers)

  return {
    ...mapVolumeToBook(volume),
    subtitle: info.subtitle,
    publisher: info.publisher,
    pageCount: info.pageCount,
    printedPageCount: info.printedPageCount,
    categories: info.categories,
    language: info.language,
    averageRating: info.averageRating,
    ratingsCount: info.ratingsCount,
    previewLink: info.previewLink,
    infoLink: info.infoLink,
    maturityRating: info.maturityRating,
    isbn10,
    isbn13,
    coverUrl: pickCoverUrl(volume.id, info.imageLinks, 'large'),
  }
}

function getApiKey(): string | null {
  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
  if (!apiKey) {
    console.error('Falta la variable de entorno en el .env')
    return null
  }
  return apiKey
}

export async function searchBooks(query: string): Promise<Book[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const apiKey = getApiKey()
  if (!apiKey) return []

  const url = new URL('https://www.googleapis.com/books/v1/volumes')
  url.searchParams.set('q', trimmed)
  url.searchParams.set('maxResults', '10')
  url.searchParams.set('key', apiKey)

  try {
    const response = await fetch(url)
    if (!response.ok) return []

    const data: GoogleBooksResponse = await response.json()
    return (data.items ?? []).map(mapVolumeToBook)
  } catch {
    return []
  }
}

export async function getBookDetail(volumeId: string): Promise<BookDetail | null> {
  const apiKey = getApiKey()
  if (!apiKey) return null

  const url = new URL(`https://www.googleapis.com/books/v1/volumes/${volumeId}`)
  url.searchParams.set('key', apiKey)

  try {
    const response = await fetch(url)
    if (!response.ok) return null

    const data: GoogleVolume = await response.json()
    return mapVolumeToDetail(data)
  } catch {
    return null
  }
}
