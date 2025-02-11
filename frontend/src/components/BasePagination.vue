<template>
  <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        :disabled="currentPage === 1"
        @click="$emit('page-change', currentPage - 1)"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
      >
        Previous
      </button>
      <button
        :disabled="currentPage === totalPages"
        @click="$emit('page-change', currentPage + 1)"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
      >
        Next
      </button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{{ from }}</span>
          to
          <span class="font-medium">{{ to }}</span>
          of
          <span class="font-medium">{{ total }}</span>
          results
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            :disabled="currentPage === 1"
            @click="$emit('page-change', currentPage - 1)"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          >
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <template v-for="page in displayedPages" :key="page">
            <button
              v-if="page === '...'"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
            >
              ...
            </button>
            <button
              v-else
              @click="$emit('page-change', page)"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0"
              :class="[
                page === currentPage
                  ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>
          </template>

          <button
            :disabled="currentPage === totalPages"
            @click="$emit('page-change', currentPage + 1)"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
          >
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  from: number
  to: number
  total: number
}>()

defineEmits<{
  (e: 'page-change', page: number): void
}>()

const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  const maxDisplayed = 7 // Maximum number of page buttons to show
  const halfDisplay = Math.floor(maxDisplayed / 2)

  if (props.totalPages <= maxDisplayed) {
    // Show all pages if total is less than max display
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    // Calculate start and end of displayed pages
    let start = Math.max(2, props.currentPage - halfDisplay)
    let end = Math.min(props.totalPages - 1, props.currentPage + halfDisplay)

    // Adjust if current page is near the start
    if (props.currentPage <= halfDisplay + 1) {
      end = maxDisplayed - 1
    }
    // Adjust if current page is near the end
    else if (props.currentPage >= props.totalPages - halfDisplay) {
      start = props.totalPages - (maxDisplayed - 2)
    }

    // Add ellipsis if needed at start
    if (start > 2) {
      pages.push('...')
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis if needed at end
    if (end < props.totalPages - 1) {
      pages.push('...')
    }

    // Always show last page
    pages.push(props.totalPages)
  }

  return pages
})
</script>
