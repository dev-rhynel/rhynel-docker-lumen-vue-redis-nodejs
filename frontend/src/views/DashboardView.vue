<template>
  <div class="home-container p-12">
    <div class="welcome-section mb-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Welcome to {{ user?.name }}'s Dashboard</h1>
        <div class="flex items-center">
          <BaseButton label="Logout" @click="handleLogout" :loading="logoutLoading" variant="secondary" />
        </div>
      </div>
      <div v-if="user" class="text-lg text-gray-600">
        Welcome back, {{ user.name }}!
      </div>
    </div>

    <div class="posts-section bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Posts</h2>
        <div class="flex items-center">
          <BaseButton label="New Post" @click="showNewPostModal = true" />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Content</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Author</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="postsLoading" class="animate-pulse">
              <td colspan="4" class="p-4 text-center text-gray-500">Loading posts...</td>
            </tr>
            <tr v-else-if="posts.length === 0">
              <td colspan="4" class="p-4 text-center text-gray-500">No posts found</td>
            </tr>
            <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ post.title }}</td>
              <td class="px-3 py-4 text-sm text-gray-500">{{ truncateContent(post.content) }}</td>
              <td class="px-3 py-4 text-sm text-gray-500">{{ post.user.first_name }} {{ post.user.last_name }}</td>
              <td class="px-3 py-4 text-sm text-gray-500">{{ formatDate(post.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <BasePagination
        v-if="posts.length > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        :from="pagination.from"
        :to="pagination.to"
        :total="totalItems"
        @page-change="handlePageChange"
      />
    </div>

    <!-- New Post Modal -->
    <div v-if="showNewPostModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                @click="showNewPostModal = false"
                class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg font-semibold leading-6 text-gray-900 mb-4">Create New Post</h3>
                <form @submit.prevent="handleCreatePost" class="space-y-4">
                  <div>
                    <BaseInput
                      id="title"
                      v-model="newPost.title"
                      label="Title"
                      required
                      placeholder="Enter post title"
                    />
                  </div>
                  <div>
                    <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                      id="content"
                      v-model="newPost.content"
                      rows="4"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Write your post content here"
                      required
                    ></textarea>
                  </div>
                  <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <BaseButton
                      type="submit"
                      label="Create Post"
                      :loading="createPostLoading"
                      class="w-full sm:w-auto sm:ml-3"
                    />
                    <BaseButton
                      type="button"
                      label="Cancel"
                      variant="secondary"
                      @click="showNewPostModal = false"
                      class="mt-3 w-full sm:w-auto sm:mt-0"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAccountStore } from '@/stores/account.store'
import { usePosts } from '@/composables/usePosts'
import BaseButton from '@/components/form-fields/BaseButton.vue'
import BaseInput from '@/components/form-fields/BaseInput.vue'
import BasePagination from '@/components/BasePagination.vue'

const router = useRouter()
const { signOut, setAccount } = useAuth()
const accountStore = useAccountStore()
const { posts, loading: postsLoading, pagination, currentPage, totalPages, totalItems, fetchPosts, createPost, goToPage } = usePosts()

const user = computed(() => accountStore.user)
const logoutLoading = ref(false)
const showNewPostModal = ref(false)
const createPostLoading = ref(false)
const newPost = ref({
  title: '',
  content: ''
})

const loading = ref(true)

onMounted(async () => {
  try {
    loading.value = true
    const userData = await setAccount()
    console.log('Mounted user data:', userData)
    if (!userData) {
      console.error('No user data received')
      router.push('/login')
      return
    }
    await fetchPosts()
  } catch (error) {
    console.error('Error loading dashboard:', error)
    router.push('/login')
  } finally {
    loading.value = false
  }
})

const handleLogout = async () => {
  try {
    logoutLoading.value = true
    await signOut()
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    logoutLoading.value = false
  }
}

const handlePageChange = (page: number) => {
  goToPage(page)
}

const handleCreatePost = async () => {
  try {
    createPostLoading.value = true
    await createPost(newPost.value)
    showNewPostModal.value = false
    newPost.value = { title: '', content: '' }
  } catch (error) {
    console.error('Failed to create post:', error)
  } finally {
    createPostLoading.value = false
  }
}

const truncateContent = (content: string, length: number = 100) => {
  if (content.length <= length) return content
  return content.substring(0, length) + '...'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

