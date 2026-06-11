import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button, Input } from '@/components/ui'
import { ROUTES } from '@/router/routes'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useAuthStore(state => state.login)
  const navigate = useNavigate()

  const handleLogin = () => {
    login()
    navigate(ROUTES.HOME)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-4 p-8 bg-white rounded-xl shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Metrico</h1>
        <Input label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
        />
        <Button label="Login" onClick={handleLogin} fullWidth />
      </div>
    </div>
  )
}

export default Login
