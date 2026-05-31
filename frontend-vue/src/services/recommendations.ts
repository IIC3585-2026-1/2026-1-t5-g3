import type {
  CreateRecommendationPayload,
  ProfileRecommendation,
  UpdateRecommendationPayload,
} from '../types/social'
import { resolveCoverUrl } from '../utils/bookCover'
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
  book: {
    id: string
    externalApiId: string
    title: string
    authors: string[]
    thumbnailUrl?: string
    description?: string
    pageCount?: number
  }
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
    book: {
      ...item.book,
      thumbnailUrl: resolveCoverUrl(
        item.book.externalApiId,
        item.book.thumbnailUrl,
      ),
    },
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

export function updateRecommendation(
  id: string,
  payload: UpdateRecommendationPayload,
): Promise<ProfileRecommendation> {
  return apiFetch<RecommendationApiResponse>(`/recommendations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }).then(mapRecommendation)
}

export function removeRecommendation(id: string): Promise<void> {
  return apiFetch<void>(`/recommendations/${id}`, { method: 'DELETE' })
}

export { mapRecommendation }
