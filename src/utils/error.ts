import axios from 'axios'

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data

    // Server returned a message
    if (data?.message) return data.message

    // Network error
    if (error.code === 'ERR_NETWORK') {
      return 'Unable to connect to server. Please check your connection.'
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.'
    }
  }

  if (error instanceof Error) return error.message

  return 'Something went wrong. Please try again.'
}
