import type { Book } from '../types/book'

interface GoogleVolume {
  id: string
  volumeInfo?: {
    title?: string
    authors?: string[]
    description?: string
    imageLinks?: {
      thumbnail?: string
    }
  }
}

interface GoogleBooksResponse {
  items?: GoogleVolume[]
}

function mapVolumeToBook(volume: GoogleVolume): Book {
  const info = volume.volumeInfo ?? {}
  return {
    id: volume.id,
    title: info.title ?? 'Sin título',
    authors: info.authors ?? ['Autor desconocido'],
    thumbnail: info.imageLinks?.thumbnail,
    description: info.description,
  }
}

export async function searchBooks(query: string): Promise<Book[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
  if (!apiKey) {
    console.error('Falta la variable de entorno en el .env')
    return []
  }

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
