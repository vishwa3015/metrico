import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from './routes'

type Props = { children: React.ReactNode }

const PublicRoute = ({ children }: Props) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  return isAuthenticated ? <Navigate to={ROUTES.HOME} replace /> : <>{children}</>
}

export default PublicRoute
