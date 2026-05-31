import { get, writable } from 'svelte/store'
import type { ProfileRecommendation, UserProfile } from '../types/social'
import * as followsService from '../services/follows'
import * as recommendationsService from '../services/recommendations'
import * as usersService from '../services/users'
import { isAuthenticated } from './auth'

export const profile = writable<UserProfile | null>(null)
export const profileLoading = writable(false)
export const profileError = writable<string | null>(null)

export const friendsRecommendations = writable<ProfileRecommendation[]>([])
export const friendsRecommendationsLoading = writable(false)
export const friendsRecommendationsError = writable<string | null>(null)

export async function loadUserProfile(userId: string): Promise<void> {
  profileLoading.set(true)
  profileError.set(null)

  try {
    profile.set(await usersService.fetchUserProfile(userId))
  } catch (error) {
    profileError.set(
      error instanceof Error ? error.message : 'Error al cargar el perfil',
    )
    profile.set(null)
  } finally {
    profileLoading.set(false)
  }
}

export async function followUser(userId: string): Promise<void> {
  await followsService.followUser(userId)
  if (get(profile)?.id === userId) {
    await loadUserProfile(userId)
  }
  await loadFriendsRecommendations()
}

export async function unfollowUser(userId: string): Promise<void> {
  await followsService.unfollowUser(userId)
  if (get(profile)?.id === userId) {
    await loadUserProfile(userId)
  }
  await loadFriendsRecommendations()
}

export async function loadFriendsRecommendations(): Promise<void> {
  if (!get(isAuthenticated)) {
    friendsRecommendations.set([])
    return
  }

  friendsRecommendationsLoading.set(true)
  friendsRecommendationsError.set(null)

  try {
    friendsRecommendations.set(
      await recommendationsService.fetchFriendsRecommendations(),
    )
  } catch (error) {
    friendsRecommendationsError.set(
      error instanceof Error
        ? error.message
        : 'Error al cargar recomendaciones de amigos',
    )
    friendsRecommendations.set([])
  } finally {
    friendsRecommendationsLoading.set(false)
  }
}

export function clearSocial(): void {
  profile.set(null)
  profileError.set(null)
  friendsRecommendations.set([])
  friendsRecommendationsError.set(null)
}
