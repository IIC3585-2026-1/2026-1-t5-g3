import type { UserProfile, UserSummary } from '../types/social'
import { apiFetch } from './api'

export function searchUsers(query: string): Promise<UserSummary[]> {
  const params = new URLSearchParams({ q: query })
  return apiFetch<UserSummary[]>(`/users/search?${params}`)
}

export function fetchUserProfile(userId: string): Promise<UserProfile> {
  return apiFetch<UserProfile>(`/users/${userId}/profile`)
}
