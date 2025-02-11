import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BasePagination from '../BasePagination.vue'

describe('BasePagination', () => {
  it('renders correctly', () => {
    const wrapper = mount(BasePagination, {
      props: {
        currentPage: 1,
        totalPages: 5,
        from: 1,
        to: 10,
        total: 50
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('nav[aria-label="Pagination"]').exists()).toBe(true)
  })

  it('emits page-change event when clicking next', async () => {
    const wrapper = mount(BasePagination, {
      props: {
        currentPage: 1,
        totalPages: 5,
        from: 1,
        to: 10,
        total: 50
      }
    })
    await wrapper.find('button:not([disabled]):has(svg)').trigger('click')
    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')[0]).toEqual([2])
  })

  it('disables next button on last page', () => {
    const wrapper = mount(BasePagination, {
      props: {
        currentPage: 5,
        totalPages: 5
      }
    })
    expect(wrapper.find('button:last-child').attributes('disabled')).toBeDefined()
  })

  it('disables previous button on first page', () => {
    const wrapper = mount(BasePagination, {
      props: {
        currentPage: 1,
        totalPages: 5,
        from: 1,
        to: 10,
        total: 50
      }
    })
    expect(wrapper.find('button:first-child').attributes('disabled')).toBeDefined()
  })
})
