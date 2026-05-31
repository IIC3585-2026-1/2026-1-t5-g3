export type ApiFetch = <T>(
  path: string,
  options?: RequestInit,
) => Promise<T>

const DEFAULT_API_URL = 'http://localhost:3000'

export function createApiClient(
  getToken: () => string | null,
  apiUrl?: string,
): ApiFetch {
  const baseUrl = apiUrl ?? DEFAULT_API_URL

  return async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers = new Headers(options.headers)

    if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json')
    }

    const token = getToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const data: { message?: string | string[] } = await response
        .json()
        .catch(() => ({}))

      const message = Array.isArray(data.message)
        ? data.message.join(', ')
        : (data.message ?? 'Error en la solicitud')

      throw new Error(message)
    }

    if (response.status === 204) {
      return undefined as T
    }

    const text = await response.text()
    if (!text) {
      return undefined as T
    }

    return JSON.parse(text) as T
  }
}
