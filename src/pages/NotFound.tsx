import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { ROUTES } from '@/router/routes'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center gap-4">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-gray-400">Page not found</p>
      <Button onClick={() => navigate(ROUTES.HOME)} />
    </div>
  )
}

export default NotFound
