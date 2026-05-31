import type { UserProfile, UserSummary } from '../types/social'
import type { ApiFetch } from '../api'

export function createUsersService(apiFetch: ApiFetch) {
  return {
    searchUsers(query: string): Promise<UserSummary[]> {
      const params = new URLSearchParams({ q: query })
      return apiFetch<UserSummary[]>(`/users/search?${params}`)
    },

    fetchUserProfile(userId: string): Promise<UserProfile> {
      return apiFetch<UserProfile>(`/users/${userId}/profile`)
    },

    fetchUserFriends(userId: string): Promise<UserSummary[]> {
      return apiFetch<UserSummary[]>(`/users/${userId}/friends`)
    },
  }
}
