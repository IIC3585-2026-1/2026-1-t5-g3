import type {
  AuthResponse,
  LoginCredentials,
  RegisterPayload,
} from '../types/user'
import type { ApiFetch } from '../api'

export function createAuthService(apiFetch: ApiFetch) {
  return {
    login(credentials: LoginCredentials): Promise<AuthResponse> {
      return apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
    },

    register(payload: RegisterPayload): Promise<AuthResponse> {
      return apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    },

    getProfile() {
      return apiFetch<{ id: string; name: string; email: string }>(
        '/auth/profile',
      )
    },
  }
}
