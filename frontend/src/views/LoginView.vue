<template>

  <div class="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">

    <div class="sm:mx-auto sm:w-full sm:max-w-md">

      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Login</h2>

    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">

      <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">

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
               <RouterLink to="/signup" class="font-medium text-blue-600 hover:text-blue-500"
                > Don't have an account? Sign up </RouterLink
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

const router = useRouter()
const {signIn} = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    const response = await signIn({
      email: email.value,
      password: password.value,
    })
    if (response) {
      router.push({name: 'home'})
    }
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

