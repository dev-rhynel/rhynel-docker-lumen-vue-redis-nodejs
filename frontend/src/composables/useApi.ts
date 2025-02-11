import axios, {AxiosError, type AxiosRequestConfig} from 'axios'
import {useSession} from './useSession'

interface ApiErrorResponse {
  message?: string
  status?: number
  errors?: string | string[] | Record<string, string[]>
}

export function useApi() {
  const {getSessionToken} = useSession()
  // const config = useRuntimeConfig()

  const axiosInstance = axios.create({
    // baseURL: config.public.apiBase,
  })

  // Add request interceptor for auth token
  axiosInstance.interceptors.request.use(config => {
    const token = getSessionToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  const handleError = (error: AxiosError<ApiErrorResponse>): ApiErrorResponse => {
    return {
      message: error.message,
      status: error.response?.status,
      errors: error.response?.data?.errors || '',
    }
  }

  const _get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.get<T>(url, config)
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError<ApiErrorResponse>)
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
      throw handleError(error as AxiosError<ApiErrorResponse>)
    }
  }

  const _delete = async (url: string, config?: AxiosRequestConfig): Promise<void> => {
    try {
      await axiosInstance.delete(url, config)
    } catch (error) {
      throw handleError(error as AxiosError<ApiErrorResponse>)
    }
  }

  const _put = async <T>(url: string, payload: object, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.put<T>(url, payload, config)
      return response.data
    } catch (error) {
      throw handleError(error as AxiosError<ApiErrorResponse>)
    }
  }

  return {_get, _post, _delete, _put, handleError}
}
