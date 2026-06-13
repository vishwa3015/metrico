import { apiClient } from '@/lib/apiClient'
import type { ApiResponse } from '../types/auth.types'
import type { ResultFilters, ResultsResponse, TestResultDetail } from '../types/result.types'

const ResultService = {
  getResults: async (filters: ResultFilters = {}): Promise<ResultsResponse> => {
    // Remove empty string values before sending
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined)
    )
    const { data } = await apiClient.get<ApiResponse<ResultsResponse>>('/results', { params })
    return data.data
  },

  getResultById: async (result_id: string): Promise<TestResultDetail> => {
    const { data } = await apiClient.get<ApiResponse<{ data: TestResultDetail }>>(
      `/results/${result_id}`
    )
    return data.data.data
  },
}

export default ResultService