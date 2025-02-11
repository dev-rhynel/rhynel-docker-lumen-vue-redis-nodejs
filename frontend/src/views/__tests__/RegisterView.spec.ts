import {describe, it, expect, beforeEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {createPinia, setActivePinia} from 'pinia'
import RegisterView from '../RegisterView.vue'
import {makeServer} from '@/mocks/server'

describe('RegisterView', () => {
  let server: any

  beforeEach(() => {
    setActivePinia(createPinia())
    server = makeServer({environment: 'test'})
  })

  afterEach(() => {
    server.shutdown()
  })

  it('renders properly', () => {
    const wrapper = mount(RegisterView)
    expect(wrapper.find('h2').text()).toBe('Create Account')
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.findAll('input')).toHaveLength(4) // firstName, lastName, email, password
  })

  it('shows validation errors for empty fields', async () => {
    const wrapper = mount(RegisterView)
    await wrapper.find('form').trigger('submit')

    // Check if validation messages are shown
    const errorMessages = wrapper.findAll('.error-message')
    expect(errorMessages.length).toBeGreaterThan(0)
  })

  it('handles successful registration', async () => {
    const wrapper = mount(RegisterView)

    // Fill in the form
    await wrapper.find('input#firstName').setValue('John')
    await wrapper.find('input#lastName').setValue('Doe')
    await wrapper.find('input[type="email"]').setValue('john.doe@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')

    // Submit the form
    await wrapper.find('form').trigger('submit')

    // Verify that the registration was successful
    // This will depend on your implementation, but you might want to check:
    // - If the user was redirected
    // - If the store was updated
    // - If success message was shown
  })

  it('handles registration with existing email', async () => {
    const wrapper = mount(RegisterView)

    // Fill in the form with an existing email
    await wrapper.find('input#firstName').setValue('Test')
    await wrapper.find('input#lastName').setValue('User')
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')

    // Submit the form
    await wrapper.find('form').trigger('submit')

    // Verify that error message is shown
    const errorMessage = wrapper.find('.error-message')
    expect(errorMessage.exists()).toBe(true)
    expect(errorMessage.text()).toContain('Email already exists')
  })
})
