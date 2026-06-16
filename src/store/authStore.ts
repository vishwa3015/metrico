import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthUser } from '../types/auth.types'
import AuthService from '@/services/auth.service'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setAccessToken: (token: string) => void
  fetchMe: () => Promise<void>
  getOrganizationId: () => string | null
  getFacilityId: () => string | null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const data = await AuthService.login({ email, password })
          set({
            user: data.user,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await AuthService.logout()
        } catch {
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          })
        }
      },

      setAccessToken: (token) => {
        set({ accessToken: token })
      },

      fetchMe: async () => {
        try {
          const user = await AuthService.me()
          set({ user, isAuthenticated: true })
        } catch {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          })
        }
      },
      getOrganizationId: () => get().user?.organization_id ?? null,
      getFacilityId: () => get().user?.facility_id ?? null,
    }),
    {
      name: 'metrico-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
