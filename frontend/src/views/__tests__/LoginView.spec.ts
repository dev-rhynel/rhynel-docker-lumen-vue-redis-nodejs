import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest'
import {mount} from '@vue/test-utils'
import {createPinia, setActivePinia} from 'pinia'
import LoginView from '../LoginView.vue'
import {makeServer} from '@/mocks/server'

vi.mock('vue-router', () => ({
  RouterLink: {
    name: 'RouterLink',
    template: '<a><slot/></a>'
  }
}))

const mockRouter = {
  push: vi.fn()
}

describe('LoginView', () => {
  let server: any

  beforeEach(() => {
    setActivePinia(createPinia())
    server = makeServer({environment: 'test'})
  })

  afterEach(() => {
    server.shutdown()
  })

  it('renders properly', () => {
    const wrapper = mount(LoginView, {
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    })
    expect(wrapper.find('h2').text()).toBe('Login')
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.findAll('input')).toHaveLength(2) // email and password
  })

  it('shows validation errors for empty fields', async () => {
    const wrapper = mount(LoginView, {
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    })
    await wrapper.find('form').trigger('submit')

    // Check if validation messages are shown
    const errorMessages = wrapper.findAll('.text-red-800')
    expect(errorMessages.length).toBeGreaterThan(0)
  })

  it('handles successful login', async () => {
    const wrapper = mount(LoginView, {
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    })

    // Fill in the form
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')

    // Submit the form
    await wrapper.find('form').trigger('submit')

    // Verify that the login was successful
    // This will depend on your implementation, but you might want to check:
    // - If the user was redirected
    // - If the store was updated
    // - If success message was shown
  })

  it('handles failed login', async () => {
    const wrapper = mount(LoginView, {
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    })

    // Fill in the form with invalid credentials
    await wrapper.find('input[type="email"]').setValue('wrong@example.com')
    await wrapper.find('input[type="password"]').setValue('wrongpassword')

    // Submit the form
    await wrapper.find('form').trigger('submit')

    // Verify that error message is shown
    const errorMessage = wrapper.find('.text-red-800')
    expect(errorMessage.exists()).toBe(true)
    expect(errorMessage.text()).toBe('Invalid email or password')
  })
})
