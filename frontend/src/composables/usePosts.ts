import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from './useApi'
import { useSession } from './useSession'

export interface Post {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
}

export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
  links: PaginationLink[]
  path: string
  per_page: number
  to: number
  total: number
}

export const usePosts = () => {
  const { _get, _post, _put, _delete } = useApi()
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const pagination = ref<PaginationMeta>({
    current_page: 1,
    from: 0,
    last_page: 1,
    path: '',
    per_page: 10,
    to: 0,
    total: 0,
    links: []
  })

  const currentPage = computed(() => pagination.value.current_page)
  const totalPages = computed(() => pagination.value.last_page)
  const totalItems = computed(() => pagination.value.total)
  const itemsPerPage = computed(() => pagination.value.per_page)

  const fetchPosts = async (page: number = 1) => {
    try {
      loading.value = true
      const response = await _get(`posts?page=${page}`) as any
      console.log('Posts response:', response)

      if (response?.data) {
        // Extract posts from the response data
        posts.value = response.data || []

        // Extract pagination metadata from the response
        const { data, ...paginationData } = response.data
        pagination.value = paginationData
        console.log('Updated pagination:', pagination.value)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      loading.value = false
    }
  }

  const createPost = async (data: { title: string; content: string }) => {
    try {
      loading.value = true
      console.log('Creating post with data:', data)

      interface CreatePostResponse {
        data: Post;
        message: string;
        status: number;
      }
      
      const { getSessionToken } = useSession()
      const token = getSessionToken()
      
      if (!token) {
        throw new Error('Authentication required')
      }
      
      const response = await _post<CreatePostResponse>('posts', data)
      console.log('Create post response:', response)

      if (response?.data) {
        console.log('Post created successfully, fetching updated posts')
        await fetchPosts(pagination.value.current_page)
      }
      return response
    } catch (error: any) {
      console.error('Failed to create post:', {
        error,
        message: error.message,
        response: error.response?.data
      })
      if (error.response?.status === 401) {
        const { clearSessionToken } = useSession()
        clearSessionToken()
        throw new Error('Authentication required')
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  const updatePost = async (id: number, data: { title: string; content: string }) => {
    try {
      loading.value = true
      interface UpdatePostResponse {
        data: Post;
        message: string;
        status: number;
      }
      
      const response = await _put<UpdatePostResponse>(`posts/${id}`, data)
      if (response?.data) {
        await fetchPosts(pagination.value.current_page)
      }
      return response
    } catch (error) {
      console.error('Failed to update post:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deletePost = async (id: number) => {
    try {
      loading.value = true
      const response = await _delete(`posts/${id}`)
      if (response) {
        // If we're on the last page and it's now empty, go to previous page
        const isLastPage = pagination.value.current_page === pagination.value.last_page
        const isLastItem = pagination.value.total === 1
        const newPage = isLastPage && isLastItem && pagination.value.current_page > 1
          ? pagination.value.current_page - 1
          : pagination.value.current_page

        await fetchPosts(newPage)
      }
      return response
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const goToPage = async (page: number) => {
    if (page >= 1 && page <= pagination.value.last_page) {
      await fetchPosts(page)
    }
  }

  return {
    posts,
    loading,
    pagination,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    fetchPosts,
    createPost,
    goToPage,
    updatePost,
    deletePost
  }
}
