import { apiClient } from "@/lib/apiClient"
import { ApiTestResult, ResultsParams, ResultsResponse } from "@/types/results.types"

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
}