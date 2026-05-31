export interface UserSummary {
  id: string
  name: string
}

export interface FollowStatus {
  isFollowing: boolean
  isFollowedBy: boolean
  isFriend: boolean
}

export interface ProfileRecommendation {
  id: string
  rating: number
  message?: string
  createdAt: string
  user: UserSummary
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

export interface UserProfile {
  id: string
  name: string
  readThisYear: number
  recommendations: ProfileRecommendation[]
  friendsCount: number
  followingCount: number
  followersCount: number
  friends: UserSummary[]
  followStatus: FollowStatus | null
}

export interface CreateRecommendationPayload {
  userBookId: string
  rating: number
  message?: string
}

export interface UpdateRecommendationPayload {
  rating?: number
  message?: string
}
