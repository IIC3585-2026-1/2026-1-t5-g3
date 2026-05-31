import { services } from './instance'

const { recommendations } = services

export const mapRecommendation = recommendations.mapRecommendation
export const fetchFriendsRecommendations =
  recommendations.fetchFriendsRecommendations
export const createRecommendation = recommendations.createRecommendation
export const updateRecommendation = recommendations.updateRecommendation
export const removeRecommendation = recommendations.removeRecommendation
