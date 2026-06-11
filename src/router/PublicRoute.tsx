import { Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import { useAuthStore } from '../store/authStore'

type Props = { children: React.ReactNode }

const PublicRoute = ({ children }: Props) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  return isAuthenticated ? <Navigate to={ROUTES.HOME} replace /> : <>{children}</>
}

export default PublicRoute
