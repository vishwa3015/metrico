export type UserRole = 'Admin' | 'Supervisor' | 'Testing Staff'
export type UserStatus = 'Active' | 'Inactive' | 'Invited'

export interface ApiUser {
    user_id: string
    organization_id: string
    facility_id: string | null
    first_name: string
    last_name: string
    email: string
    role: UserRole
    status: UserStatus
    web_access_enabled: boolean
    email_sent?: boolean
    last_login_at: string | null
    created_at: string
    updated_at: string
    facility?: {
        facility_id: string
        facility_name: string
    } | null
}

export interface UsersParams {
    search?: string
    role?: UserRole
    facility_id?: string
    status?: UserStatus
    page?: number
    limit?: number
}

export interface UsersResponse {
    users: ApiUser[]
    pagination: {
        total: number
        page: number
        limit: number
        pages: number
    }
}

export interface CreateUserPayload {
    first_name: string
    last_name: string
    email: string
    role: UserRole
    facility_id: string
}

export interface CreateUserResponse {
    user: ApiUser
    temp_password?: string
}