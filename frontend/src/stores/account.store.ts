import {AuthStatus} from '@/composables/useEnum'
import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import type {UserInterface} from '@/types/user'

export const useAccountStore = defineStore(
  'account',
  () => {
    const user = ref<UserInterface>({} as UserInterface)
    const authState = ref<AuthStatus>(AuthStatus.Unauthenticated)

    const isAuthenticated = computed(() => authState.value === AuthStatus.Authenticated)

    function setUserState(newUser: UserInterface) {
      user.value = newUser
    }

    function setAuthState(newAuthState: AuthStatus = AuthStatus.Unauthenticated) {
      authState.value = newAuthState
    }

    return {
      user,
      authState,
      isAuthenticated,
      setUserState,
      setAuthState,
    }
  },
  {
    persist: true,
  }
)
