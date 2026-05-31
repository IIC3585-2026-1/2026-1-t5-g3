import { createApiClient } from '../api'
import { createAuthService } from './createAuthService'
import { createFollowsService } from './createFollowsService'
import { createGoogleBooksService } from './createGoogleBooksService'
import { createRecommendationsService } from './createRecommendationsService'
import { createUserBooksService } from './createUserBooksService'
import { createUsersService } from './createUsersService'

export interface CreateServicesConfig {
  getToken: () => string | null
  apiUrl?: string
  googleBooksApiKey?: string | null
}

export function createServices(config: CreateServicesConfig) {
  const apiFetch = createApiClient(config.getToken, config.apiUrl)

  return {
    apiFetch,
    auth: createAuthService(apiFetch),
    userBooks: createUserBooksService(apiFetch),
    users: createUsersService(apiFetch),
    follows: createFollowsService(apiFetch),
    recommendations: createRecommendationsService(apiFetch),
    googleBooks: createGoogleBooksService(config.googleBooksApiKey),
  }
}
