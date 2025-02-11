<template>
   <button
    :type="type"
    :disabled="disabled || loading"
    class="base-button"
    :class="{'is-loading': loading}"
  >
     <slot v-if="!loading">{{ label }}</slot
    > <span v-else>{{ loadingText }}</span
    > </button
  >
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    loadingText?: string
  }>(),
  {
    type: 'button',
    disabled: false,
    loading: false,
    loadingText: 'Loading...',
  }
)
</script>

<style scoped>
.base-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.base-button:hover:not(:disabled) {
  background-color: #45a049;
}

.base-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.is-loading {
  position: relative;
  color: transparent;
}

.is-loading::after {
  content: '';
  position: absolute;
  width: 1rem;
  height: 1rem;
  top: 50%;
  left: 50%;
  margin: -0.5rem 0 0 -0.5rem;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-right-color: transparent;
  animation: spin 0.75s infinite linear;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>

