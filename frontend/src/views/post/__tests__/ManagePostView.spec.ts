import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useRouter, useRoute } from 'vue-router'
import ManagePostView from '../ManagePostView.vue'
import { usePost } from '@/composables/usePost'

// Create mock functions
const mockPush = vi.fn()
const mockCreatePost = vi.fn()
const mockUpdatePost = vi.fn()
const mockGetPost = vi.fn()

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush
  })),
  useRoute: vi.fn(() => ({
    params: {
      id: undefined
    }
  }))
}))

// Mock the usePost composable
vi.mock('@/composables/usePost', () => ({
  usePost: vi.fn(() => ({
    createPost: mockCreatePost,
    updatePost: mockUpdatePost,
    getPost: mockGetPost
  }))
}))

describe('ManagePostView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock implementations
    mockCreatePost.mockResolvedValue({ data: { id: 1 } })
    mockUpdatePost.mockResolvedValue({ data: { id: 1 } })
    mockGetPost.mockResolvedValue({ 
      data: { id: 1, title: 'Existing Title', content: 'Existing Content' } 
    })
  })

  it('renders create post form by default', () => {
    const wrapper = mount(ManagePostView, {
      global: {
        stubs: {
          'base-input': true,
          'base-button': true
        }
      }
    })

    expect(wrapper.find('h2').text()).toBe('Create New Post')
    expect(wrapper.findComponent({ name: 'base-input' }).exists()).toBe(true)
    expect(wrapper.find('#content').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'base-button' }).exists()).toBe(true)
  })

  it('submits new post correctly', async () => {
    const wrapper = mount(ManagePostView, {
      global: {
        stubs: {
          'base-input': true,
          'base-button': true
        }
      }
    })

    // Fill in the form
    await wrapper.findComponent({ name: 'base-input' }).vm.$emit('update:modelValue', 'Test Title')
    await wrapper.find('#content').setValue('Test Content')

    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')
    await vi.waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith({
        title: 'Test Title',
        content: 'Test Content'
      })
    })
    expect(mockPush).toHaveBeenCalledWith('/posts')
  })

  it('loads and updates existing post correctly', async () => {
    // Mock route with ID
    vi.mocked(useRoute).mockReturnValue({
      params: {
        id: '1'
      }
    })

    const wrapper = mount(ManagePostView, {
      global: {
        stubs: {
          'base-input': true,
          'base-button': true
        }
      }
    })

    // Wait for component to load post data
    await vi.waitFor(() => {
      expect(mockGetPost).toHaveBeenCalledWith('1')
    })

    // Update form values
    await wrapper.findComponent({ name: 'base-input' }).vm.$emit('update:modelValue', 'Updated Title')
    await wrapper.find('#content').setValue('Updated Content')

    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')
    await vi.waitFor(() => {
      expect(mockUpdatePost).toHaveBeenCalledWith('1', {
        title: 'Updated Title',
        content: 'Updated Content'
      })
    })
    expect(mockPush).toHaveBeenCalledWith('/posts')
  })

  it('handles form submission errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error')
    
    // Mock createPost to throw an error
    mockCreatePost.mockRejectedValueOnce(new Error('API Error'))

    const wrapper = mount(ManagePostView, {
      global: {
        stubs: {
          'base-input': true,
          'base-button': true
        }
      }
    })

    // Fill and submit form
    await wrapper.findComponent({ name: 'base-input' }).vm.$emit('update:modelValue', 'Test Title')
    await wrapper.find('#content').setValue('Test Content')
    await wrapper.find('form').trigger('submit.prevent')

    // Wait for the error to be logged
    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })
    expect(mockPush).not.toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })

  it('navigates back to posts on cancel', async () => {
    const wrapper = mount(ManagePostView, {
      global: {
        stubs: {
          'base-input': true,
          'base-button': true
        }
      }
    })
    
    // Click cancel button
    await wrapper.findComponent({ name: 'base-button' }).vm.$emit('click')

    // Verify navigation
    expect(mockPush).toHaveBeenCalledWith('/posts')
  })
})
