import { services } from './instance'

const { follows } = services

export const followUser = follows.followUser
export const unfollowUser = follows.unfollowUser
export const fetchMyFriends = follows.fetchMyFriends
