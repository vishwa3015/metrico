import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Download } from 'lucide-react'
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
              <AppLayout
                topBarActions={
                  <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-teal-500 to-teal-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-teal-700/20 hover:from-teal-500 hover:to-teal-700">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                }
              >
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