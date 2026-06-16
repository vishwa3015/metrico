export type UserRole = 'Admin' | 'Supervisor' | 'Testing Staff'

export interface AuthUser {
  user_id: string
  first_name: string
  last_name: string
  email: string
  role: UserRole
  organization_id: string
  facility_id: string
  last_login_at?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: AuthUser
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ApiError {
  success: false
  message: string
  errors?: { field: string; message: string }[]
}
