<template>

  <div class="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">

    <div class="sm:mx-auto sm:w-full sm:max-w-2xl">

      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
         {{ editMode ? 'Edit Post' : 'Create New Post' }}
      </h2>

    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">

      <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">

        <form @submit.prevent="handleSubmit" class="space-y-6">

          <div>
             <BaseInput
              id="title"
              type="text"
              label="Title"
              v-model="post.title"
              required
              placeholder="Enter post title"
            />
          </div>

          <div>
             <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
            <div class="mt-1">
               <textarea
                id="content"
                v-model="post.content"
                rows="8"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Write your post content here..."
                required
              />
            </div>

          </div>

          <div class="flex justify-end space-x-4">
             <BaseButton
              type="button"
              variant="secondary"
              label="Cancel"
              @click="handleCancel"
              class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            /> <BaseButton
              type="submit"
              :loading="loading"
              :loadingText="editMode ? 'Updating...' : 'Creating...'"
              :label="editMode ? 'Update Post' : 'Create Post'"
              class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
          </div>

        </form>

      </div>

    </div>

  </div>

</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {usePost, type Post} from '@/composables/usePost'
import BaseInput from '@/components/form-fields/BaseInput.vue'
import BaseButton from '@/components/form-fields/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const {createPost, getPost, updatePost} = usePost()

const editMode = ref(false)
const loading = ref(false)
const post = ref<Post>({
  title: '',
  content: '',
})

onMounted(async () => {
  const postId = route.params.id
  if (postId) {
    editMode.value = true
    loading.value = true
    try {
      const response = await getPost(postId)
      post.value = response.data
    } catch (error) {
      console.error('Failed to fetch post:', error)
      router.push('/posts')
    } finally {
      loading.value = false
    }
  }
})

const handleSubmit = async () => {
  loading.value = true
  try {
    if (editMode.value) {
      await updatePost(route.params.id as string, post.value)
    } else {
      await createPost(post.value)
    }
    router.push('/posts')
  } catch (error) {
    console.error('Failed to save post:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/posts')
}
</script>
