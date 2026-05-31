import { computed, ref } from 'vue'
import { getErrorMessage, type User } from '@mybooks/shared'
import * as authService from '../services/auth'
import { clearBooks, loadUserBooks } from './books'
import { clearSocial, loadFriendsRecommendations } from './social'

const TOKEN_KEY = 'mybooks_token'
const USER_KEY = 'mybooks_user'

export const token = ref<string | null>(null)
export const user = ref<User | null>(null)
export const authError = ref<string | null>(null)
export const authLoading = ref(false)

export const isAuthenticated = computed(() => !!token.value)

export function initAuth(): void {
  const storedToken = localStorage.getItem(TOKEN_KEY)
  const storedUser = localStorage.getItem(USER_KEY)

  if (storedToken && storedUser) {
    token.value = storedToken
    user.value = JSON.parse(storedUser) as User
  }
}

function persistAuth(accessToken: string, authUser: User): void {
  token.value = accessToken
  user.value = authUser
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(USER_KEY, JSON.stringify(authUser))
}

export async function login(email: string, password: string): Promise<void> {
  authLoading.value = true
  authError.value = null

  try {
    const response = await authService.login({ email, password })
    persistAuth(response.accessToken, response.user)
    await loadUserBooks()
    await loadFriendsRecommendations()
  } catch (error) {
    authError.value = getErrorMessage(error, 'Error al iniciar sesión')
    throw error
  } finally {
    authLoading.value = false
  }
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  authLoading.value = true
  authError.value = null

  try {
    const response = await authService.register({ name, email, password })
    persistAuth(response.accessToken, response.user)
    await loadUserBooks()
    await loadFriendsRecommendations()
  } catch (error) {
    authError.value = getErrorMessage(error, 'Error al registrarse')
    throw error
  } finally {
    authLoading.value = false
  }
}

export function logout(): void {
  token.value = null
  user.value = null
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  clearBooks()
  clearSocial()
}
