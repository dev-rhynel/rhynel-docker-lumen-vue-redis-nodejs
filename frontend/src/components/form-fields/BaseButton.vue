<template>
   <button
    :type="type"
    :disabled="disabled || loading"
    class="base-button"
    :class="[
      {'is-loading': loading},
      `base-button--${variant}`
    ]"
  >
     <slot v-if="!loading">{{ label }}</slot
    > <span v-else>{{ loadingText }}</span
    > </button
  >
</template>

<script setup lang="ts">
type ButtonVariant = 'primary' | 'error' | 'warning' | 'info' | 'default'

withDefaults(
  defineProps<{
    label?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    loadingText?: string
    variant?: ButtonVariant
  }>(),
  {
    type: 'button',
    disabled: false,
    loading: false,
    loadingText: 'Loading...',
    variant: 'default'
  }
)
</script>

<style scoped>
.base-button {
  width: 100%;
  padding: 0.75rem;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.base-button--primary {
  background-color: #4caf50;
}

.base-button--primary:hover:not(:disabled) {
  background-color: #45a049;
}

.base-button--error {
  background-color: #dc3545;
}

.base-button--error:hover:not(:disabled) {
  background-color: #c82333;
}

.base-button--warning {
  background-color: #ffc107;
  color: #212529;
}

.base-button--warning:hover:not(:disabled) {
  background-color: #e0a800;
}

.base-button--info {
  background-color: #17a2b8;
}

.base-button--info:hover:not(:disabled) {
  background-color: #138496;
}

.base-button--default {
  background-color: #6c757d;
}

.base-button--default:hover:not(:disabled) {
  background-color: #5a6268;
}

.base-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
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
  border: 2px solid currentColor;
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

