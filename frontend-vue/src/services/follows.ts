import type { UserSummary } from '../types/social'
import { apiFetch } from './api'

export function followUser(userId: string): Promise<void> {
  return apiFetch<void>(`/follows/${userId}`, { method: 'POST' })
}

export function unfollowUser(userId: string): Promise<void> {
  return apiFetch<void>(`/follows/${userId}`, { method: 'DELETE' })
}

export function fetchMyFriends(): Promise<UserSummary[]> {
  return apiFetch<UserSummary[]>('/follows/me/friends')
}
