import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ROUTES } from '../router/routes'
import { getApiErrorMessage } from '../utils/error'

interface LoginForm {
    email: string
    password: string
}

interface FormErrors {
    email?: string
    password?: string
    general?: string
}

export const useLogin = () => {
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)
    const isLoading = useAuthStore((state) => state.isLoading)

    const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
    const [errors, setErrors] = useState<FormErrors>({})

    const validate = (): boolean => {
        const newErrors: FormErrors = {}

        if (!form.email.trim()) {
            newErrors.email = 'Email is required.'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Please enter a valid email address.'
        }

        if (!form.password) {
            newErrors.password = 'Password is required.'
        } else if (form.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters.'
        } else if (!/[A-Z]/.test(form.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter.'
        } else if (!/[0-9]/.test(form.password)) {
            newErrors.password = 'Password must contain at least one number.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (field: keyof LoginForm) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
        // Clear field error on change
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        if (!validate()) return

        try {
            await login(form.email.trim(), form.password)
            navigate(ROUTES.HOME, { replace: true })
        } catch (error) {
            const message = getApiErrorMessage(error)
            setErrors({ general: message })
        }
    }

    return {
        form,
        errors,
        isLoading,
        handleChange,
        handleSubmit,
    }
}
