import { ref, computed } from 'vue'
import { useApi } from './useApi'

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

export interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
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
    total: 0
  })

  const currentPage = computed(() => pagination.value.current_page)
  const totalPages = computed(() => pagination.value.last_page)
  const totalItems = computed(() => pagination.value.total)
  const itemsPerPage = computed(() => pagination.value.per_page)

  const fetchPosts = async (page: number = 1) => {
    try {
      loading.value = true
      const response = await _get(`posts?page=${page}`) as any
      if (response.data?.value?.data) {
        posts.value = response.data.value.data
        // Update pagination meta
        if (response.data.value.meta) {
          pagination.value = response.data.value.meta
        }
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
      interface CreatePostResponse {
        data: Post;
        message: string;
        status: number;
      }
      
      const response = await _post<CreatePostResponse>('posts', data)
      if (response?.data) {
        await fetchPosts(pagination.value.current_page)
      }
      return response
    } catch (error) {
      console.error('Failed to create post:', error)
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
    goToPage
  }
}
