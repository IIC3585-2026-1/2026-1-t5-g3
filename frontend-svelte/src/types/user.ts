export interface User {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}
