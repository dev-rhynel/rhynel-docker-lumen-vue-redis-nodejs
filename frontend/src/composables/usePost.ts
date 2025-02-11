import {useApi} from './useApi'

export interface Post {
  id?: number
  title: string
  content: string
  userId?: number
  createdAt?: string
  updatedAt?: string
}

export const usePost = () => {
  const {_get, _post, _put, _delete} = useApi()

  const getPosts = async (): Promise<{data: Post[]}> => {
    return await _get('posts')
  }

  const getPost = async (id: number | string): Promise<{data: Post}> => {
    return await _get(`posts/${id}`)
  }

  const createPost = async (post: Post): Promise<{data: Post}> => {
    return await _post('posts', post)
  }

  const updatePost = async (id: number | string, post: Post): Promise<{data: Post}> => {
    return await _put(`posts/${id}`, post)
  }

  const deletePost = async (id: number | string): Promise<void> => {
    return await _delete(`posts/${id}`)
  }

  return {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
  }
}
