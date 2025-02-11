import VueCookies from 'vue-cookies'

export const useSession = () => {
  const vCookies: any = VueCookies

  const getSessionToken = () => {
    return vCookies.get('token') ?? ''
  }

  const setSessionToken = (token: string | null = null) => {
    if (token) {
      // Set token with 24 hour expiration
      const expires = new Date()
      expires.setHours(expires.getHours() + 24)
      
      vCookies.set('token', token, {
        expires,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
      })
    } else {
      vCookies.remove('token')
    }
  }

  const clearSessionToken = () => {
    vCookies.remove('token')
  }

  return {
    getSessionToken,
    setSessionToken,
    clearSessionToken,
  }
}
