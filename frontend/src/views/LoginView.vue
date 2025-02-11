<template>

  <div class="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">

    <div class="sm:mx-auto sm:w-full sm:max-w-md">

      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Login</h2>

    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">

      <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <!-- Error Alert -->
        <div v-if="error" class="mb-4 rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <!-- Heroicon name: mini/x-circle -->
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ errorMessage }}</h3>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">

          <div>
             <BaseInput
              id="email"
              type="email"
              label="Email"
              v-model="email"
              required
              placeholder="Enter your email"
            />
          </div>

          <div>
             <BaseInput
              id="password"
              type="password"
              label="Password"
              v-model="password"
              required
              placeholder="Enter your password"
            />
          </div>

          <div>
             <BaseButton
              type="submit"
              :loading="loading"
              loadingText="Logging in..."
              label="Login"
              class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            />
          </div>

          <div class="mt-6 flex items-center justify-center">

            <div class="text-sm">
              Don't have an account? <RouterLink to="/register" class="font-medium text-blue-600 hover:text-blue-500"
                > Register </RouterLink
              >
            </div>

          </div>

        </form>

      </div>

    </div>

  </div>

</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useAuth} from '@/composables/useAuth'
import BaseInput from '@/components/form-fields/BaseInput.vue'
import BaseButton from '@/components/form-fields/BaseButton.vue'

const {signIn} = useAuth()

const email = ref('rhynelmail@gmail.com')
const password = ref('planetshakerss9iS1234!!')
const loading = ref(false)
const error = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    error.value = false
    errorMessage.value = ''
    loading.value = true

    const response = await signIn({
      email: email.value,
      password: password.value,
    })

    if (!response?.data?.token) {
      errorMessage.value = 'Invalid credentials'
      error.value = true
      return
    }

  } catch (e: any) {
    error.value = true
    errorMessage.value = e.message || 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>

