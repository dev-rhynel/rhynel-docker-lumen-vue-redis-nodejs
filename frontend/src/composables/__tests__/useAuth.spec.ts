import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {setActivePinia, createPinia} from 'pinia'
import {useAuth} from '../useAuth'
import {makeServer} from '@/mocks/server'

describe('useAuth', () => {
  let server: any

  beforeEach(() => {
    setActivePinia(createPinia())
    server = makeServer({environment: 'test'})
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should successfully sign in with valid credentials', async () => {
    const {signIn} = useAuth()
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    }

    const result = await signIn(credentials)
    expect(result.success).toBe(true)
    expect(result.data.user.email).toBe(credentials.email)
    expect(result.data.token).toBeDefined()
  })

  it('should fail to sign in with invalid credentials', async () => {
    const {signIn} = useAuth()
    const credentials = {
      email: 'wrong@example.com',
      password: 'wrongpassword',
    }

    const result = await signIn(credentials)
    expect(result.success).toBe(false)
    expect(result.message).toBe('Invalid credentials')
  })

  it('should successfully register a new user', async () => {
    const {register} = useAuth()
    const newUser = {
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
    }

    const result = await register(newUser)
    expect(result.success).toBe(true)
    expect(result.data.user.email).toBe(newUser.email)
    expect(result.data.user.firstName).toBe(newUser.firstName)
    expect(result.data.token).toBeDefined()
  })

  it('should fail to register with existing email', async () => {
    const {register} = useAuth()
    const existingUser = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    }

    const result = await register(existingUser)
    expect(result.success).toBe(false)
    expect(result.message).toBe('Email already exists')
  })

  it('should successfully sign out', async () => {
    const {signOut} = useAuth()
    const result = await signOut()
    expect(result.success).toBe(true)
  })
})
