import type { ApiFetch } from '../api'

export function createFollowsService(apiFetch: ApiFetch) {
  return {
    followUser(userId: string): Promise<void> {
      return apiFetch<void>(`/follows/${userId}`, { method: 'POST' })
    },

    unfollowUser(userId: string): Promise<void> {
      return apiFetch<void>(`/follows/${userId}`, { method: 'DELETE' })
    },

    fetchMyFriends() {
      return apiFetch<{ id: string; name: string }[]>('/follows/me/friends')
    },
  }
}
