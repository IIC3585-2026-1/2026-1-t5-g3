import { services } from './instance'

const { users } = services

export const searchUsers = users.searchUsers
export const fetchUserProfile = users.fetchUserProfile
export const fetchUserFriends = users.fetchUserFriends
