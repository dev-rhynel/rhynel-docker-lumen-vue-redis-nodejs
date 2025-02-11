import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest'
import {setActivePinia, createPinia} from 'pinia'
import {useAuth} from '../useAuth'
import {makeServer} from '@/mocks/server'

const mockPost = vi.fn()
const mockGet = vi.fn()
const mockDelete = vi.fn()
const mockPush = vi.fn()
const mockGetSessionToken = vi.fn()
const mockSetSessionToken = vi.fn()

vi.mock('../useApi', () => ({
  useApi: () => ({
    _post: mockPost,
    _get: mockGet,
    _delete: mockDelete
  })
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

vi.mock('../useSession', () => ({
  useSession: () => ({
    getSessionToken: mockGetSessionToken,
    setSessionToken: mockSetSessionToken
  })
}))

describe('useAuth', () => {
  let server: any

  beforeEach(() => {
    setActivePinia(createPinia())
    server = makeServer({environment: 'test'})
    server.namespace = 'api/v1'
    vi.clearAllMocks()
    mockGetSessionToken.mockReturnValue(null)
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should successfully sign in with valid credentials', async () => {
    const mockResponse = {
      success: true,
      data: {
        token: 'fake-token',
        user: {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User'
        }
      }
    }
    mockPost.mockResolvedValueOnce(mockResponse)
    mockGetSessionToken.mockReturnValueOnce('fake-token')
    mockGet.mockResolvedValueOnce({ data: mockResponse.data.user })

    const {signIn} = useAuth()
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    }

    const result = await signIn(credentials)
    expect(result.success).toBe(true)
    expect(result.data.user.email).toBe(credentials.email)
    expect(result.data.token).toBeDefined()
    expect(mockPush).toHaveBeenCalledWith({ path: '/dashboard' })
  })

  it('should fail to sign in with invalid credentials', async () => {
    const mockResponse = {
      success: false,
      message: 'Invalid credentials'
    }
    mockPost.mockResolvedValueOnce(mockResponse)

    const {signIn} = useAuth()
    const credentials = {
      email: 'wrong@example.com',
      password: 'wrongpassword',
    }

    const result = await signIn(credentials)
    expect(result.success).toBe(false)
    expect(result.message).toBe('Invalid credentials')
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should successfully register a new user', async () => {
    const mockResponse = {
      success: true,
      data: {
        token: 'fake-token',
        user: {
          email: 'newuser@example.com',
          firstName: 'New',
          lastName: 'User'
        }
      }
    }
    mockPost.mockResolvedValueOnce(mockResponse)
    mockGetSessionToken.mockReturnValueOnce('fake-token')
    mockGet.mockResolvedValueOnce({ data: mockResponse.data.user })

    const {signUp} = useAuth()
    const newUser = {
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
    }

    const result = await signUp(newUser)
    expect(result.success).toBe(true)
    expect(result.data.user.email).toBe(newUser.email)
    expect(result.data.user.firstName).toBe(newUser.firstName)
    expect(result.data.token).toBeDefined()
    expect(mockPush).toHaveBeenCalledWith({ path: '/dashboard' })
  })

  it('should fail to register with existing email', async () => {
    const mockResponse = {
      success: false,
      message: 'Email already exists'
    }
    mockPost.mockResolvedValueOnce(mockResponse)

    const {signUp} = useAuth()
    const existingUser = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    }

    const result = await signUp(existingUser)
    expect(result.success).toBe(false)
    expect(result.message).toBe('Email already exists')
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should successfully sign out', async () => {
    mockGetSessionToken.mockReturnValueOnce('fake-token')
    mockDelete.mockResolvedValueOnce({
      success: true,
      message: 'Successfully logged out'
    })

    const {signOut} = useAuth()
    await signOut()

    expect(mockDelete).toHaveBeenCalledWith(`auth/logout`)
    expect(mockSetSessionToken).toHaveBeenCalledWith(null)
    expect(mockPush).toHaveBeenCalledWith('/login')
  })
})
