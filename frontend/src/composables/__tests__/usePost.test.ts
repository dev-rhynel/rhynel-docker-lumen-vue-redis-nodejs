import {describe, it, expect, vi, beforeEach} from 'vitest'
import {usePost} from '../usePost'
import {useApi} from '../useApi'

// Mock useApi
const mockGet = vi.fn().mockImplementation(() => Promise.resolve())
const mockPost = vi.fn().mockImplementation(() => Promise.resolve())
const mockPut = vi.fn().mockImplementation(() => Promise.resolve())
const mockDelete = vi.fn().mockImplementation(() => Promise.resolve())

vi.mock('../useApi', () => ({
  useApi: () => ({
    _get: mockGet,
    _post: mockPost,
    _put: mockPut,
    _delete: mockDelete,
  }),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  })
}))

describe('usePost', () => {
  const mockPostResponse = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    userId: 1,
    createdAt: '2024-02-11T00:00:00Z',
    updatedAt: '2024-02-11T00:00:00Z',
  }

  let getPosts: any, getPost: any, createPost: any, updatePost: any, deletePost: any

  beforeEach(() => {
    vi.clearAllMocks()

    const postComposable = usePost()
    getPosts = postComposable.getPosts
    getPost = postComposable.getPost
    createPost = postComposable.createPost
    updatePost = postComposable.updatePost
    deletePost = postComposable.deletePost
  })

  describe('getPosts', () => {
    it('should fetch all posts', async () => {
      const mockResponse = {data: [mockPostResponse]}
      mockGet.mockResolvedValueOnce(mockResponse)

      const result = await getPosts()

      expect(mockGet).toHaveBeenCalledWith('posts')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getPost', () => {
    it('should fetch a single post by id', async () => {
      const mockResponse = {data: mockPostResponse}
      mockGet.mockResolvedValueOnce(mockResponse)

      const result = await getPost(1)

      expect(mockGet).toHaveBeenCalledWith('posts/1')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('createPost', () => {
    it('should create a new post', async () => {
      const newPost = {title: 'New Post', content: 'New Content'}
      const mockResponse = {data: {...newPost, id: 1}}
      mockPost.mockResolvedValueOnce(mockResponse)

      const result = await createPost(newPost)

      expect(mockPost).toHaveBeenCalledWith('posts', newPost)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updatePost', () => {
    it('should update an existing post', async () => {
      const updatedPost = {title: 'Updated Post', content: 'Updated Content'}
      const mockResponse = {data: {...updatedPost, id: 1}}
      mockPut.mockResolvedValueOnce(mockResponse)

      const result = await updatePost(1, updatedPost)

      expect(mockPut).toHaveBeenCalledWith('posts/1', updatedPost)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deletePost', () => {
    it('should delete a post', async () => {
      mockDelete.mockResolvedValueOnce(undefined)

      await deletePost(1)

      expect(mockDelete).toHaveBeenCalledWith('posts/1')
    })
  })
})
