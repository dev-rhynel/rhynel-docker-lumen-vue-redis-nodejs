import {useAccountStore} from '@/stores/account.store'
import {useApi} from './useApi'
import {useRouter} from 'vue-router'
import {useSession} from './useSession'
import {AuthStatus} from '@/composables/useEnum'

export const useAuth = () => {
  const {_post, _get, _delete} = useApi()
  const router = useRouter()
  const {getSessionToken, setSessionToken} = useSession()
  const {setUserState, setAuthState} = useAccountStore()

  const signIn = async (payload: object) => {
    const response = await _post('account/auth/signin', payload)
    return afterAuthAction(response)
  }

  const signUp = async (payload: object) => {
    const response = await _post('account/auth/register', payload)
    return afterAuthAction(response)
  }

  const afterAuthAction = async (response: any) => {
    const resInterface = response as Response

    const {data} = response

    if (data?.token) {
      setSessionToken(data.token)

      if (getSessionToken()) {
        await setAccount()
        router.push({path: '/account/dashboard'})
      }
    }
    return resInterface
  }

  const clearSession = (isRedirectToLogin: boolean = true) => {
    setSessionToken()
    setUserState({} as any)
    setAuthState(AuthStatus.Unauthenticated)
    if (isRedirectToLogin) return router.push('/account/auth')
  }

  const setAccount = async (key: string = '') => {
    try {
      const response = await _get(key ? `/account/profile?key=${key}` : '/account/profile')
      const resInterface = response as ResponseInterface
      const {data} = resInterface

      if (data) {
        if (data === 'ok') return
        setUserState(data as any)
        setAuthState(AuthStatus.Authenticated)
      }
    } catch (error) {
      clearSession()
    }
  }

  const signOut = async () => {
    try {
      if (getSessionToken()) {
        await _delete('account/auth/logout')
      }
    } finally {
      clearSession()
    }
  }

  return {
    signIn,
    signUp,
    setAccount,
    signOut,
  }
}
