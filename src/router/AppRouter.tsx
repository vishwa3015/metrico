import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { ROUTES } from './routes'
import PublicRoute from './PublicRoute'
import { AppLayout } from '../layouts/AppLayout'
import { TestResults } from '../pages/TestResults'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import PrivateRoute from './PrivateRoute'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <Login />
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

function DashboardPage() {
  const navigate = useNavigate()
  return <Dashboard onOpenResults={() => navigate(ROUTES.RESULTS)} />
}

export default AppRouter
