<template>

  <div class="mb-4">
     <label :for="id" v-if="label" class="mb-1 block text-sm font-medium text-gray-700"
      > {{ label }} </label
    > <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      v-bind="$attrs"
      class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': error}"
    /> <span v-if="error" class="mt-1 text-sm text-red-600"> {{ error }} </span>
  </div>

</template>

<script setup lang="ts">
defineProps<{
  id: string
  label?: string
  modelValue: string
  type?: string
  error?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

