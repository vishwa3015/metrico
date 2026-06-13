import { useState, useEffect, useCallback, useRef } from 'react'
import ResultService from '../services/result.service'
import type {
    TestResult,
    ResultFilters,
    Pagination,
    TestType,
    ResultStatus,
    SortBy,
    SortOrder,
} from '../types/result.types'

const DEFAULT_FILTERS: ResultFilters = {
    test_type: '',
    result_status: '',
    sync_status: '',
    sort_by: 'tested_at',
    sort_order: 'DESC',
    page: 1,
    page_size: 25,
}

export function useResults() {
    const [results, setResults] = useState<TestResult[]>([])
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        page_size: 25,
        total_pages: 0,
    })
    const [filters, setFilters] = useState<ResultFilters>(DEFAULT_FILTERS)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Debounce search — avoid firing on every keystroke
    const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const fetchResults = useCallback(async (f: ResultFilters) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await ResultService.getResults(f)
            setResults(response.data)
            setPagination(response.pagination)
        } catch {
            setError('Failed to load results. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Fetch whenever filters change
    useEffect(() => {
        fetchResults(filters)
    }, [filters, fetchResults])

    // --- Filter setters (each resets to page 1) ---

    const setTestType = (test_type: TestType | '') => {
        setFilters(prev => ({ ...prev, test_type, page: 1 }))
    }

    const setResultStatus = (result_status: ResultStatus | '') => {
        setFilters(prev => ({ ...prev, result_status, page: 1 }))
    }

    const setDateRange = (date_from: string, date_to: string) => {
        setFilters(prev => ({ ...prev, date_from, date_to, page: 1 }))
    }

    const setUserId = (user_id: string) => {
        setFilters(prev => ({ ...prev, user_id, page: 1 }))
    }

    const setDeviceId = (device_id: string) => {
        setFilters(prev => ({ ...prev, device_id, page: 1 }))
    }

    // Sorting — toggle direction if same column
    const setSort = (sort_by: SortBy) => {
        setFilters(prev => ({
            ...prev,
            sort_by,
            sort_order:
                prev.sort_by === sort_by && prev.sort_order === 'DESC' ? 'ASC' : 'DESC',
            page: 1,
        }))
    }

    // Pagination
    const setPage = (page: number) => {
        setFilters(prev => ({ ...prev, page }))
    }

    const setPageSize = (page_size: number) => {
        setFilters(prev => ({ ...prev, page_size, page: 1 }))
    }

    const clearFilters = () => {
        setFilters(DEFAULT_FILTERS)
    }

    const refresh = () => fetchResults(filters)

    return {
        results,
        pagination,
        filters,
        isLoading,
        error,
        setTestType,
        setResultStatus,
        setDateRange,
        setUserId,
        setDeviceId,
        setSort,
        setPage,
        setPageSize,
        clearFilters,
        refresh,
    }
}