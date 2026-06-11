import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ROUTES } from './routes'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'

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
              <Home />
            </PrivateRoute>
          }
        />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
