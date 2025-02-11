import VueCookies from 'vue-cookies'

export const useSession = () => {
  const vCookies: any = VueCookies

  const getSessionToken = () => {
    const token = vCookies.get('token')
    console.log('Getting token from cookie:', token) // Debug log
    return token || ''
  }

  const setSessionToken = (token: string | null = null) => {
    console.log('Setting token:', token) // Debug log
    if (token) {
      // Set token with 24 hour expiration
      const expires = new Date()
      expires.setHours(expires.getHours() + 24)
      
      // Ensure token doesn't already have Bearer prefix
      const cleanToken = token.replace('Bearer ', '')
      
      vCookies.set('token', cleanToken, {
        expires,
        path: '/',
        secure: false, // Set to false for local development
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
