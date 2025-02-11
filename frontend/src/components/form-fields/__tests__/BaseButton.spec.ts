import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('renders button with default slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me'
      }
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('applies loading state correctly', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true,
        loadingText: 'Loading...',
        label: 'Submit'
      }
    })
    expect(wrapper.classes()).toContain('is-loading')
    expect(wrapper.text()).toBe('Loading...')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('applies different variants correctly', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'error'
      }
    })
    expect(wrapper.classes()).toContain('base-button--error')
  })

  it('applies disabled state correctly', () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
