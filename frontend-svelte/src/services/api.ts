import { get } from 'svelte/store'
import { token } from '../stores/auth'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  const currentToken = get(token)
  if (currentToken) {
    headers.set('Authorization', `Bearer ${currentToken}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
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
