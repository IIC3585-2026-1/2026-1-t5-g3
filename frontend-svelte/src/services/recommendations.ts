import type {
  CreateRecommendationPayload,
  ProfileRecommendation,
} from '../types/social'
import type { ApiBook } from '../types/apiBook'
import { mapApiBookCover } from '../types/apiBook'
import { apiFetch } from './api'

interface RecommendationApiResponse {
  id: string
  rating: number
  message?: string
  createdAt: string
  user: {
    id: string
    name: string
  }
  book: ApiBook
}

function mapRecommendation(
  item: RecommendationApiResponse,
): ProfileRecommendation {
  return {
    id: item.id,
    rating: item.rating,
    message: item.message,
    createdAt: item.createdAt,
    user: item.user,
    book: mapApiBookCover(item.book),
  }
}

export function fetchFriendsRecommendations(): Promise<ProfileRecommendation[]> {
  return apiFetch<RecommendationApiResponse[]>('/recommendations/friends').then(
    (items) => items.map(mapRecommendation),
  )
}

export function createRecommendation(
  payload: CreateRecommendationPayload,
): Promise<ProfileRecommendation> {
  return apiFetch<RecommendationApiResponse>('/recommendations', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(mapRecommendation)
}

export function removeRecommendation(id: string): Promise<void> {
  return apiFetch<void>(`/recommendations/${id}`, { method: 'DELETE' })
}
