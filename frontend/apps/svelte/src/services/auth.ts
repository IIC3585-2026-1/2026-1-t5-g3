import { services } from './instance'

const { auth } = services

export const login = auth.login
export const register = auth.register
export const getProfile = auth.getProfile
