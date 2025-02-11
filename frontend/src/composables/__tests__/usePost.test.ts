import {describe, it, expect, vi, beforeEach} from 'vitest'
import {usePost} from '../usePost'
import {useApi} from '../useApi'

// Mock useApi
vi.mock('../useApi', () => ({
  useApi: () => ({
    _get: vi.fn(),
    _post: vi.fn(),
    _put: vi.fn(),
    _delete: vi.fn(),
  }),
}))

describe('usePost', () => {
  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    userId: 1,
    createdAt: '2024-02-11T00:00:00Z',
    updatedAt: '2024-02-11T00:00:00Z',
  }

  const {getPosts, getPost, createPost, updatePost, deletePost} = usePost()
  const {_get, _post, _put, _delete} = useApi()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPosts', () => {
    it('should fetch all posts', async () => {
      const mockResponse = {data: [mockPost]}
      vi.mocked(_get).mockResolvedValueOnce(mockResponse)

      const result = await getPosts()

      expect(_get).toHaveBeenCalledWith('posts')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getPost', () => {
    it('should fetch a single post by id', async () => {
      const mockResponse = {data: mockPost}
      vi.mocked(_get).mockResolvedValueOnce(mockResponse)

      const result = await getPost(1)

      expect(_get).toHaveBeenCalledWith('posts/1')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('createPost', () => {
    it('should create a new post', async () => {
      const newPost = {title: 'New Post', content: 'New Content'}
      const mockResponse = {data: {...newPost, id: 1}}
      vi.mocked(_post).mockResolvedValueOnce(mockResponse)

      const result = await createPost(newPost)

      expect(_post).toHaveBeenCalledWith('posts', newPost)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updatePost', () => {
    it('should update an existing post', async () => {
      const updatedPost = {title: 'Updated Post', content: 'Updated Content'}
      const mockResponse = {data: {...updatedPost, id: 1}}
      vi.mocked(_put).mockResolvedValueOnce(mockResponse)

      const result = await updatePost(1, updatedPost)

      expect(_put).toHaveBeenCalledWith('posts/1', updatedPost)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deletePost', () => {
    it('should delete a post', async () => {
      vi.mocked(_delete).mockResolvedValueOnce(undefined)

      await deletePost(1)

      expect(_delete).toHaveBeenCalledWith('posts/1')
    })
  })
})
