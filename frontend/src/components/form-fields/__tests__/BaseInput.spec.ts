import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '../BaseInput.vue'

describe('BaseInput', () => {
  it('renders input element correctly', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        label: 'Test Input',
        type: 'text',
        id: 'test-input'
      }
    })
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('label').text()).toBe('Test Input')
  })

  it('emits update:modelValue event on input', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        label: 'Test Input',
        type: 'text',
        id: 'test-input'
      }
    })
    const input = wrapper.find('input')
    await input.setValue('test value')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['test value'])
  })

  it('shows error message when provided', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        label: 'Test Input',
        type: 'text',
        id: 'test-input',
        error: 'This field is required'
      }
    })
    expect(wrapper.find('.text-red-600').text()).toBe('This field is required')
  })

  it('applies error class when error is present', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        label: 'Test Input',
        type: 'text',
        id: 'test-input',
        error: 'This field is required'
      }
    })
    expect(wrapper.find('input').classes('border-red-500')).toBe(true)
  })
})
