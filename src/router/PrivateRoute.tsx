import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import { useAuthStore } from '../store/authStore'

type Props = { children: React.ReactNode }

const PrivateRoute = ({ children }: Props) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const accessToken = useAuthStore((state) => state.accessToken)
  const fetchMe = useAuthStore((state) => state.fetchMe)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (accessToken) {
      fetchMe().finally(() => setChecking(false))
    } else {
      setChecking(false)
    }
  }, [])

  if (checking) return null

  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />
}

export default PrivateRoute
