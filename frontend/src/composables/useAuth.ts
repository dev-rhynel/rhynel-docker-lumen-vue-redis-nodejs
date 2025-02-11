import {useAccountStore} from '@/stores/account.store'
import {useApi} from './useApi'
import {useRouter} from 'vue-router'
import {useSession} from './useSession'
import {AuthStatus} from '@/composables/useEnum'

export const useAuth = () => {
  const {_post, _get, _delete} = useApi()
  const router = (() => { try { return useRouter(); } catch (e) { return { push: () => {} }; } })();
  const {getSessionToken, setSessionToken} = useSession()
  const {setUserState, setAuthState} = useAccountStore()

  const signIn = async (payload: object) => {
    const response = await _post('auth/login', payload)
    return afterAuthAction(response)
  }

  const signUp = async (payload: object) => {
    const response = await _post('auth/register', payload)
    return afterAuthAction(response)
  }

  const afterAuthAction = async (response: any) => {
    const resInterface = response || {};
    const { data } = resInterface;

    if (data?.token) {
      setSessionToken(data.token)
      
      if (getSessionToken()) {
        await setAccount()
        router.push({path: '/dashboard'})
      }
    }
    return resInterface
  }

  const clearSession = (isRedirectToLogin: boolean = true) => {
    setSessionToken(null)
    setUserState({} as any)
    setAuthState(AuthStatus.Unauthenticated)
    if (isRedirectToLogin) return router.push('/login')
  }

  const setAccount = async () => {
    try {
      const response = await _get('/auth/me') as any;
      const { data } = response || {};
      
      if (data) {
        setUserState(data)
        setAuthState(AuthStatus.Authenticated)
        return data
      }
      
      clearSession()
      return null
    } catch (error) {
      clearSession()
      return null
    }
  }

  const signOut = async () => {
    try {
      if (getSessionToken()) {
        await _delete('auth/logout')
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
