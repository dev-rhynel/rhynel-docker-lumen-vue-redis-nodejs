import axios, {AxiosError, type AxiosRequestConfig} from 'axios'
import {useSession} from './useSession'

interface ApiErrorResponse {
  message?: string
  status?: number
  errors?: string | string[] | Record<string, string[]>
}

export function useApi() {
  const { getSessionToken } = useSession()

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API,
  })

  // Add request interceptor for auth token
  axiosInstance.interceptors.request.use(config => {
    const token = getSessionToken()
    console.log('Using token for request:', { token, url: config.url })

    if (!token) {
      console.error('No authentication token available')
      return Promise.reject(new Error('Authentication token is missing'))
    }

    if (config.headers) {
      // Remove any existing Bearer prefix to avoid duplication
      const cleanToken = token.replace('Bearer ', '')
      config.headers['Authorization'] = `Bearer ${cleanToken}`
      config.headers['Accept'] = 'application/json'
      config.headers['Content-Type'] = 'application/json'

      console.log('Request headers:', {
        Authorization: config.headers['Authorization'],
        url: config.url
      })
    }
    return config
  }, error => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  })

  // Add response interceptor to handle auth errors
  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // Clear session on unauthorized
        const { clearSessionToken } = useSession()
        clearSessionToken()
      }
      return Promise.reject(error)
    }
  )

  const _handleError = (error: AxiosError<ApiErrorResponse>): never => {
    const errorResponse = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      errors: error.response?.data?.errors || '',
    }
    throw errorResponse
  }

  const _get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.get<T>(url, config)
      return response.data
    } catch (error) {
      throw _handleError(error as AxiosError<ApiErrorResponse>)
    }
  }

  const _post = async <T>(
    url: string,
    payload: object,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await axiosInstance.post<T>(url, payload, config)
      return response.data
    } catch (error) {
      throw _handleError(error as AxiosError<ApiErrorResponse>)
    }
  }

  const _delete = async (url: string, config?: AxiosRequestConfig): Promise<void> => {
    try {
      await axiosInstance.delete(url, config)
    } catch (error) {
      throw _handleError(error as AxiosError<ApiErrorResponse>)
    }
  }

  const _put = async <T>(url: string, payload: object, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.put<T>(url, payload, config)
      return response.data
    } catch (error) {
      throw _handleError(error as AxiosError<ApiErrorResponse>)
    }
  }

  return {_get, _post, _delete, _put, _handleError}
}
