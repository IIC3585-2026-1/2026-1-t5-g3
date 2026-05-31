import { ref } from 'vue'
import {
  getErrorMessage,
  type ProfileRecommendation,
  type UserProfile,
} from '@mybooks/shared'
import * as followsService from '../services/follows'
import * as recommendationsService from '../services/recommendations'
import * as usersService from '../services/users'
import { isAuthenticated } from './auth'

export const profile = ref<UserProfile | null>(null)
export const profileLoading = ref(false)
export const profileError = ref<string | null>(null)

export const friendsRecommendations = ref<ProfileRecommendation[]>([])
export const friendsRecommendationsLoading = ref(false)
export const friendsRecommendationsError = ref<string | null>(null)

export async function loadUserProfile(userId: string): Promise<void> {
  profileLoading.value = true
  profileError.value = null

  try {
    profile.value = await usersService.fetchUserProfile(userId)
  } catch (error) {
    profileError.value = getErrorMessage(error, 'Error al cargar el perfil')
    profile.value = null
  } finally {
    profileLoading.value = false
  }
}

export async function followUser(userId: string): Promise<void> {
  await followsService.followUser(userId)
  if (profile.value?.id === userId) {
    await loadUserProfile(userId)
  }
  await loadFriendsRecommendations()
}

export async function unfollowUser(userId: string): Promise<void> {
  await followsService.unfollowUser(userId)
  if (profile.value?.id === userId) {
    await loadUserProfile(userId)
  }
  await loadFriendsRecommendations()
}

export async function loadFriendsRecommendations(): Promise<void> {
  if (!isAuthenticated.value) {
    friendsRecommendations.value = []
    return
  }

  friendsRecommendationsLoading.value = true
  friendsRecommendationsError.value = null

  try {
    friendsRecommendations.value =
      await recommendationsService.fetchFriendsRecommendations()
  } catch (error) {
    friendsRecommendationsError.value = getErrorMessage(
      error,
      'Error al cargar recomendaciones de amigos',
    )
    friendsRecommendations.value = []
  } finally {
    friendsRecommendationsLoading.value = false
  }
}

export function clearSocial(): void {
  profile.value = null
  profileError.value = null
  friendsRecommendations.value = []
  friendsRecommendationsError.value = null
}
