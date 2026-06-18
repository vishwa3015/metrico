import { apiClient } from '@/lib/apiClient'
import type { ApiResponse } from '@/types/auth.types'
import type { ApiUser, CreateUserPayload, CreateUserResponse, UsersParams, UsersResponse } from '@/types/users.types'

export const usersService = {
    getUsers: async (params: UsersParams = {}): Promise<UsersResponse> => {
        const { data } = await apiClient.get<ApiResponse<UsersResponse>>('/users', { params })
        return data.data
    },

    getUserById: async (userId: string): Promise<ApiUser> => {
        const { data } = await apiClient.get<ApiResponse<{ user: ApiUser }>>(`/users/${userId}`)
        return data.data.user
    },

    createUser: async (payload: CreateUserPayload): Promise<CreateUserResponse> => {
        const { data } = await apiClient.post<ApiResponse<CreateUserResponse>>('/users', payload)
        return data.data
    },

    updateUser: async (userId: string, payload: CreateUserPayload): Promise<ApiUser> => {
        const { data } = await apiClient.patch<ApiResponse<{ user: ApiUser }>>(`/users/${userId}`, payload)
        return data.data.user
    },

    setUserStatus: async (userId: string, status: 'Active' | 'Inactive'): Promise<ApiUser> => {
        const { data } = await apiClient.patch<ApiResponse<{ user: ApiUser }>>(`/users/${userId}/status`, { status })
        return data.data.user
    },
}