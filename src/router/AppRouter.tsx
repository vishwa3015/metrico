import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { ROUTES } from './routes'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import { AppLayout } from '../layouts/AppLayout'
import { TestResults } from '../pages/TestResults'
import { useAuthStore } from '../store/authStore'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.HOME}
          element={
            <PrivateRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.RESULTS}
          element={
            <PrivateRoute>
              <AppLayout>
                <TestResults />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

function LoginPage() {
  const login = useAuthStore(state => state.login)
  return <Login onLogin={login} />
}

function DashboardPage() {
  const navigate = useNavigate()
  return <Dashboard onOpenResults={() => navigate(ROUTES.RESULTS)} />
}

export default AppRouter
