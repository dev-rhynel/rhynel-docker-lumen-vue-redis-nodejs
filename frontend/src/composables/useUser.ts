import {useApi} from './useApi'

export const useUser = () => {
  const {_get} = useApi()

  const getUser = async (id: number | string): Promise<{data: object}> => {
    return await _get(`users/${id}`)
  }

  return {
    getUser,
  }
}
