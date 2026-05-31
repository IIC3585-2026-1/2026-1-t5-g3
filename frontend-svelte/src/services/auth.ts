import type {
  AuthResponse,
  LoginCredentials,
  RegisterPayload,
  User,
} from '../types/user'
import { apiFetch } from './api'

export function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getProfile(): Promise<User> {
  return apiFetch<User>('/auth/profile')
}
