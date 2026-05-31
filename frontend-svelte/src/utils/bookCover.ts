type CoverSize = 'thumb' | 'large'

export function buildGoogleBooksCoverUrl(
  volumeId: string,
  size: CoverSize = 'thumb',
): string {
  const zoom = size === 'large' ? 2 : 1
  return `https://books.google.com/books/content?id=${volumeId}&printsec=frontcover&img=1&zoom=${zoom}&source=gbs_api`
}

export function normalizeGoogleBooksImageUrl(url?: string): string | undefined {
  if (!url) return undefined

  return url
    .replace(/^http:\/\//i, 'https://')
    .replace(/&edge=curl/g, '')
}

export function resolveCoverUrl(
  volumeId: string,
  url?: string,
  size: CoverSize = 'thumb',
): string {
  return normalizeGoogleBooksImageUrl(url) ?? buildGoogleBooksCoverUrl(volumeId, size)
}
