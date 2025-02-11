<template>

  <div class="min-h-screen bg-gray-50 py-8 sm:px-6 lg:px-8">

    <div class="sm:mx-auto sm:w-full sm:max-w-5xl">

      <div class="flex items-center justify-between">

        <h2 class="text-3xl font-bold tracking-tight text-gray-900">Posts</h2>
         <RouterLink
          to="/posts/new"
          class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          > Create New Post </RouterLink
        >
      </div>

      <div class="mt-8 flow-root">

        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">

          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">

            <div v-if="loading" class="flex justify-center py-8">

              <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>

            </div>

            <div v-else-if="posts.length === 0" class="py-8 text-center">

              <p class="text-gray-500">No posts found. Create your first post!</p>

            </div>

            <div
              v-else
              class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg"
            >

              <table class="min-w-full divide-y divide-gray-300">

                <thead class="bg-gray-50">

                  <tr>

                    <th
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                       Title
                    </th>

                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                       Content
                    </th>

                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                       Created At
                    </th>

                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                       <span class="sr-only">Actions</span>
                    </th>

                  </tr>

                </thead>

                <tbody class="divide-y divide-gray-200 bg-white">

                  <tr v-for="post in posts" :key="post.id">

                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                    >
                       {{ post.title }}
                    </td>

                    <td class="px-3 py-4 text-sm text-gray-500">
                       {{ truncateText(post.content, 100) }}
                    </td>

                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                       {{ formatDate(post.createdAt) }}
                    </td>

                    <td
                      class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                    >

                      <div class="flex justify-end space-x-2">
                         <RouterLink
                          :to="`/posts/${post.id}/edit`"
                          class="text-blue-600 hover:text-blue-900"
                          > Edit </RouterLink
                        > <button
                          @click="confirmDelete(post)"
                          class="text-red-600 hover:text-red-900"
                        >
                           Delete </button
                        >
                      </div>

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {usePost, type Post} from '@/composables/usePost'

const {getPosts, deletePost} = usePost()
const posts = ref<Post[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await getPosts()
    posts.value = response.data
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  } finally {
    loading.value = false
  }
})

const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const confirmDelete = async (post: Post) => {
  if (!post.id) return

  if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
    try {
      await deletePost(post.id)
      posts.value = posts.value.filter(p => p.id !== post.id)
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }
}
</script>

