import { apiClient } from '@/lib/apiClient'
import { ApiTestResult, ResultsParams, ResultsResponse } from '@/types/results.types'

// ─── download helper ──────────────────────────────────────────────────────────

function downloadBlob(blob: Blob, filename: string): void {
    const url  = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href     = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
        link.remove()
        URL.revokeObjectURL(url)
    }, 200)
}

// ─── service ──────────────────────────────────────────────────────────────────

export const resultsService = {
    getResults: async (params: ResultsParams = {}): Promise<ResultsResponse> => {
        const cleanParams = { ...params }
        if (cleanParams.search) {
            cleanParams.search = cleanParams.search.trim()
        }
        const { data } = await apiClient.get('/results', { params: cleanParams })
        return data.data
    },

    getResultById: async (resultId: string): Promise<ApiTestResult> => {
        const { data } = await apiClient.get(`/results/${resultId}`)
        return data.data.result
    },

    exportSelected: async (resultIds: string[]): Promise<void> => {
        const response = await apiClient.post(
            '/results/export-csv',
            { result_ids: resultIds },
            { responseType: 'blob' },
        )
        const disposition = response.headers['content-disposition'] ?? ''
        const match       = disposition.match(/filename="?([^"]+)"?/)
        const date        = new Date().toISOString().slice(0, 10)
        const filename    = match?.[1] ?? `metrico-results-${date}.csv`
        const blob        = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
        downloadBlob(blob, filename)
    },

    exportById: async (resultId: string): Promise<void> => {
        const response = await apiClient.get(
            `/results/${resultId}/export-csv`,
            { responseType: 'blob' },
        )
        const disposition = response.headers['content-disposition'] ?? ''
        const match       = disposition.match(/filename="?([^"]+)"?/)
        const filename    = match?.[1] ?? `metrico-result-${resultId}.csv`
        const blob        = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
        downloadBlob(blob, filename)
    },
}