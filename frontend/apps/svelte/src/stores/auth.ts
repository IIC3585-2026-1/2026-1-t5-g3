import { derived, writable } from 'svelte/store'
import type { User } from '@mybooks/shared'
import type { AuthResponse } from '@mybooks/shared'
import * as authService from '../services/auth'
import { getErrorMessage } from '@mybooks/shared'
import { clearBooks, loadUserBooks } from './books'
import { clearSocial, loadFriendsRecommendations } from './social'

const TOKEN_KEY = 'mybooks_token'
const USER_KEY = 'mybooks_user'

export const token = writable<string | null>(null)
export const user = writable<User | null>(null)
export const authError = writable<string | null>(null)
export const authLoading = writable(false)

export const isAuthenticated = derived(token, ($token) => !!$token)

function persistAuth(accessToken: string, authUser: User): void {
  token.set(accessToken)
  user.set(authUser)
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(USER_KEY, JSON.stringify(authUser))
}

async function validateSession(): Promise<void> {
  const profile = await authService.getProfile()
  user.set(profile)
  localStorage.setItem(USER_KEY, JSON.stringify(profile))
}

async function loadAuthenticatedData(): Promise<void> {
  await loadUserBooks()
  await loadFriendsRecommendations()
}

async function authenticate(
  authFn: () => Promise<AuthResponse>,
  fallbackError: string,
): Promise<void> {
  authLoading.set(true)
  authError.set(null)

  try {
    const response = await authFn()
    persistAuth(response.accessToken, response.user)
    await validateSession()
    await loadAuthenticatedData()
  } catch (error) {
    authError.set(getErrorMessage(error, fallbackError))
    throw error
  } finally {
    authLoading.set(false)
  }
}

export async function initAuth(): Promise<void> {
  const storedToken = localStorage.getItem(TOKEN_KEY)
  const storedUser = localStorage.getItem(USER_KEY)

  if (!storedToken || !storedUser) {
    return
  }

  token.set(storedToken)
  user.set(JSON.parse(storedUser) as User)

  try {
    await validateSession()
    await loadAuthenticatedData()
  } catch {
    logout()
  }
}

export async function login(email: string, password: string): Promise<void> {
  return authenticate(
    () => authService.login({ email, password }),
    'Error al iniciar sesión',
  )
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  return authenticate(
    () => authService.register({ name, email, password }),
    'Error al registrarse',
  )
}

export function logout(): void {
  token.set(null)
  user.set(null)
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  clearBooks()
  clearSocial()
}
