import { useEffect, useState, useCallback, useRef } from 'react'
import { resultsService } from '../services/results.service'
import type { ResultsParams, ResultsResponse } from '@/types/results.types'

export type SortField = 'tested_at' | 'test_type' | 'result_status' | 'estimated_value' | 'user_name_snapshot' | 'device_name_snapshot'
export type SortOrder = 'ASC' | 'DESC'

export interface PaginationState {
    page: number
    limit: 25 | 50 | 100
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}

export interface SortState {
    field: SortField
    order: SortOrder
}

export function useResults(baseParams: ResultsParams = {}) {
    const [data, setData] = useState<ResultsResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pageSize, setPageSize] = useState<25 | 50 | 100>(50)
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1, limit: 50, total: 0, totalPages: 0, hasNext: false, hasPrev: false,
    })

    const [fetchTick, setFetchTick] = useState(0)

    const serialised = JSON.stringify(baseParams)
    const currentPage = useRef(1)
    const currentLimit = useRef<25 | 50 | 100>(50)
    const currentSort = useRef<SortState>({ field: 'tested_at', order: 'DESC' })

    useEffect(() => {
        currentPage.current = 1
        setFetchTick(t => t + 1)
    }, [serialised])

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError(null)
        setData(null)

        resultsService.getResults({
            ...baseParams,
            page: currentPage.current,
            limit: currentLimit.current,
            sort_by: currentSort.current.field,
            sort_order: currentSort.current.order,
        }).then(res => {
            if (cancelled) return
            setData(res)
            setPagination({
                page: currentPage.current,
                limit: currentLimit.current,
                total: res.pagination.total,
                totalPages: res.pagination.total_pages,
                hasNext: res.pagination.has_next,
                hasPrev: res.pagination.has_prev,
            })
        }).catch(() => {
            if (!cancelled) setError('Failed to load results.')
        }).finally(() => {
            if (!cancelled) setLoading(false)
        })

        return () => { cancelled = true }
    }, [fetchTick])

    const goToPage = useCallback((page: number) => {
        currentPage.current = page
        setFetchTick(t => t + 1)
    }, [])

    const changePageSize = useCallback((size: 25 | 50 | 100) => {
        currentLimit.current = size
        currentPage.current = 1
        setPageSize(size)
        setFetchTick(t => t + 1)
    }, [])

    const toggleSort = useCallback((field: SortField) => {
        currentSort.current = {
            field,
            order: currentSort.current.field === field
                ? (currentSort.current.order === 'DESC' ? 'ASC' : 'DESC')
                : 'DESC'
        }
        currentPage.current = 1
        setFetchTick(t => t + 1)
    }, [])

    return {
        data, loading, error, pagination, sort: currentSort.current,
        pageSize, changePageSize,
        goToPage, toggleSort,
        refetch: () => setFetchTick(t => t + 1)
    }
}