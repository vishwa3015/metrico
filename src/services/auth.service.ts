import { apiClient } from '@/lib/apiClient'
import type {
  ApiResponse,
  AuthUser,
  LoginPayload,
  LoginResponse,
} from '../types/auth.types'

const AuthService = {
  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      payload
    )
    return data.data
  },

  logout: async () => {
    const { data } = await apiClient.post<ApiResponse<{}>>('/auth/logout')
    return data
  },

  me: async () => {
    const { data } = await apiClient.get<ApiResponse<{ user: AuthUser }>>('/auth/me')
    return data.data.user
  },

  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post<ApiResponse<{}>>('/auth/forgot-password', { email })
    return data
  },

  resetPassword: async (token: string, password: string) => {
    const { data } = await apiClient.post<ApiResponse<{}>>('/auth/reset-password', {
      token,
      password,
    })
    return data
  },

  refreshToken: async (refresh_token: string) => {
    const { data } = await apiClient.post<ApiResponse<{ access_token: string }>>(
      '/auth/refresh',
      { refresh_token }
    )
    return data.data.access_token
  },
}

export default AuthService
