import { useState, useEffect, useCallback } from 'react'
import { usersService } from '@/services/users.service'
import type { ApiUser, UsersParams } from '@/types/users.types'

interface Pagination {
    total: number
    page: number
    limit: number
    pages: number
}

interface UseUsersReturn {
    data: ApiUser[]
    loading: boolean
    error: string | null
    pagination: Pagination
    refetch: () => void
}

export function useUsers(params: UsersParams = {}): UseUsersReturn {
    const [data, setData] = useState<ApiUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState<Pagination>({
        total: 0, page: 1, limit: 50, pages: 0,
    })

    const key = JSON.stringify(params)

    const fetch = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await usersService.getUsers(params)
            setData(res.users)
            setPagination(res.pagination)
        } catch (err: any) {
            setError(err?.response?.data?.message ?? 'Failed to load users.')
        } finally {
            setLoading(false)
        }
    }, [key])

    useEffect(() => { fetch() }, [fetch])

    return { data, loading, error, pagination, refetch: fetch }
}