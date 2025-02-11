<template>
  <div class="home-container p-12">
    <div class="welcome-section mb-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Welcome to {{ user?.name }}'s Dashboard</h1>
        <div class="flex items-center">
          <BaseButton label="Logout" @click="handleLogout" :loading="logoutLoading" variant="error" />
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
          <BaseButton label="New Post" @click="() => { isEditMode = false; showPostModal = true; }" />
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
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
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
              <td class="px-3 py-4 text-sm text-gray-500">
                <div class="flex items-center space-x-3">
                  <button
                    @click="handleEditPost(post as any)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(post as any)"
                    class="text-red-600 hover:text-red-800"
                    :disabled="deleteLoading"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="posts.length > 0" class="px-6 py-4 border-t border-gray-200">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ pagination.from }}</span> to
            <span class="font-medium">{{ pagination.to }}</span> of
            <span class="font-medium">{{ pagination.total }}</span> results
          </div>
          <div class="flex space-x-2">
            <button
              v-for="link in pagination.links"
              :key="link.label"
              @click="link.url && handlePageChange(getPageFromUrl(link.url))"
              :disabled="!link.url"
              :class="[
                'px-3 py-1 rounded border',
                link.active
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                !link.url && 'opacity-50 cursor-not-allowed'
              ]"
              v-html="link.label"
            ></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Post Modal (New/Edit) -->
    <Transition>
      <div v-if="showPostModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                @click="showPostModal = false"
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
                <h3 class="text-lg font-semibold leading-6 text-gray-900 mb-4">
                  {{ isEditMode ? 'Edit Post' : 'Create New Post' }}
                </h3>
                <form @submit.prevent="handleSubmitPost" class="space-y-4">
                  <div>
                    <BaseInput
                      id="title"
                      v-model="postForm.title"
                      label="Title"
                      required
                      placeholder="Enter post title"
                    />
                  </div>
                  <div>
                    <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                      id="content"
                      v-model="postForm.content"
                      rows="4"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Write your post content here"
                      required
                    ></textarea>
                  </div>
                  <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <BaseButton
                      type="submit"
                      :label="isEditMode ? 'Save Changes' : 'Create Post'"
                      :loading="postModalLoading"
                      class="w-full sm:w-auto sm:ml-3"
                      variant="primary"
                    />
                    <BaseButton
                      type="button"
                      label="Cancel"
                      variant="default"
                      @click="showPostModal = false"
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
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition>
      <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 class="text-base font-semibold leading-6 text-gray-900">Delete Post</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete this post? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <BaseButton
                type="button"
                label="Delete"
                variant="error"
                :loading="deleteLoading"
                @click="handleDeletePost"
                class="w-full sm:w-auto sm:ml-3"
              />
              <BaseButton
                type="button"
                label="Cancel"
                variant="default"
                @click="showDeleteModal = false"
                class="mt-3 w-full sm:w-auto sm:mt-0"
                :disabled="deleteLoading"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </Transition>
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
const { posts, loading: postsLoading, pagination, currentPage, totalPages, totalItems, fetchPosts, createPost, updatePost, deletePost, goToPage } = usePosts()

const user = computed(() => accountStore.user)
const logoutLoading = ref<boolean>(false)
const showPostModal = ref<boolean>(false)
const postModalLoading = ref<boolean>(false)
const isEditMode = ref<boolean>(false)
const editingPostId = ref<number | null>(null)
const postForm = ref<{ title: string; content: string }>({
  title: '',
  content: ''
})

const loading = ref<boolean>(true)
const deleteLoading = ref<boolean>(false)
const showDeleteModal = ref<boolean>(false)
const postToDelete = ref<PostInterface | null>(null)

onMounted(async () => {
  try {
    loading.value = true
    await fetchPosts()
  } catch (error) {
    console.error('Error loading dashboard:', error)
  } finally {
    loading.value = false
  }
})

const handleLogout = async () => {
  try {
    logoutLoading.value = true
    await signOut()
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    logoutLoading.value = false
  }
}

const getPageFromUrl = (url: string | null): number => {
  if (!url) return 1
  const match = url.match(/[?&]page=(\d+)/)
  return match ? parseInt(match[1]) : 1
}

const handlePageChange = (page: number) => {
  goToPage(page)
}

const handleEditPost = (post: PostInterface) => {
  postForm.value = {
    title: post.title,
    content: post.content
  }
  editingPostId.value = post.id
  isEditMode.value = true
  showPostModal.value = true
}

const handleSubmitPost = async () => {
  try {
    if (!postForm.value.title || !postForm.value.content) {
      console.error('Post form validation failed:', postForm.value)
      return
    }

    postModalLoading.value = true
    
    if (isEditMode.value && editingPostId.value) {
      await updatePost(editingPostId.value, postForm.value)
    } else {
      await createPost(postForm.value)
    }

    // Reset form and state before closing modal
    postForm.value = { title: '', content: '' }
    editingPostId.value = null
    isEditMode.value = false
    showPostModal.value = false
  } catch (error: any) {
    console.error(`Failed to ${isEditMode.value ? 'update' : 'create'} post:`, error)
  } finally {
    postModalLoading.value = false
  }
}

const truncateContent = (content: string, length: number = 100) => {
  if (content.length <= length) return content
  return content.substring(0, length) + '...'
}

const confirmDelete = (post: PostInterface) => {
  postToDelete.value = post
  showDeleteModal.value = true
}

const handleDeletePost = async () => {
  if (!postToDelete.value) return

  try {
    deleteLoading.value = true
    await deletePost(postToDelete.value.id)
    showDeleteModal.value = false
    postToDelete.value = null
  } catch (error) {
    console.error('Failed to delete post:', error)
  } finally {
    deleteLoading.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

