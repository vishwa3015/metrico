import { Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import { useAuthStore } from '../store/authStore'

type Props = { children: React.ReactNode }

const PrivateRoute = ({ children }: Props) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />
}

export default PrivateRoute
