import type { ApiBook } from './apiBook'

export interface UserSummary {
  id: string
  name: string
}

export interface FollowStatus {
  isFollowing: boolean
  isFriend: boolean
}

export interface ProfileRecommendation {
  id: string
  rating: number
  message?: string
  createdAt: string
  user: UserSummary
  book: ApiBook
}

export interface UserProfile {
  id: string
  name: string
  readThisYear: number
  recommendations: ProfileRecommendation[]
  friendsCount: number
  followingCount: number
  friends: UserSummary[]
  followStatus: FollowStatus | null
}

export interface CreateRecommendationPayload {
  userBookId: string
  rating: number
  message?: string
}
