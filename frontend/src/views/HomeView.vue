<template>

  <div class="home-container">

    <div class="welcome-section">

      <h1>Welcome to the Dashboard</h1>

      <div v-if="user" class="user-info">

        <p>Welcome back, {{ user.first_name }} {{ user.last_name }}!</p>

      </div>
       <BaseButton label="Logout" @click="handleLogout" :loading="loading" />
    </div>

  </div>

</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useAuth} from '@/composables/useAuth'
import {useAccountStore} from '@/stores/account.store'
import BaseButton from '@/components/form-fields/BaseButton.vue'

const router = useRouter()
const {signOut} = useAuth()
const accountStore = useAccountStore()
const loading = ref(false)

const user = computed(() => accountStore.user)

const handleLogout = async () => {
  try {
    loading.value = true
    await signOut()
    router.push({name: 'login'})
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.home-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.user-info {
  margin: 1.5rem 0;
  font-size: 1.2rem;
  color: #4caf50;
}

button {
  max-width: 200px;
  margin: 0 auto;
}
</style>

