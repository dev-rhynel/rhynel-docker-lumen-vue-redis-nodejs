import VueCookies from 'vue-cookies'

export const useSession = () => {
  const vCookies: any = VueCookies

  const getSessionToken = () => {
    return vCookies.get('token') ?? ''
  }

  const setSessionToken = (token: string | null = null) => {
    if (token) vCookies.set('token', token)
    else vCookies.remove('token', '')
  }

  const clearSessionToken = () => {
    vCookies.remove('token', '')
  }

  return {
    getSessionToken,
    setSessionToken,
    clearSessionToken,
  }
}
