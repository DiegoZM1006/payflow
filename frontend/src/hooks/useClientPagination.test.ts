import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useClientPagination } from './useClientPagination'

const items = Array.from({ length: 25 }, (_, index) => index + 1) // [1, 2, ..., 25]

describe('useClientPagination', () => {
  it('returns the first page and the total pages', () => {
    const { result } = renderHook(() => useClientPagination(items, 10))

    expect(result.current.page).toBe(1)
    expect(result.current.totalPages).toBe(3)
    expect(result.current.pageItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('returns a partial last page', () => {
    const { result } = renderHook(() => useClientPagination(items, 10))

    act(() => result.current.setPage(3))

    expect(result.current.pageItems).toEqual([21, 22, 23, 24, 25])
  })

  it('never stays on a page that no longer exists when the list shrinks', () => {
    const { result, rerender } = renderHook(({ list }) => useClientPagination(list, 10), {
      initialProps: { list: items },
    })
    act(() => result.current.setPage(3))

    rerender({ list: items.slice(0, 12) }) // e.g. after a search

    expect(result.current.page).toBe(2)
    expect(result.current.pageItems).toEqual([11, 12])
  })

  it('reports one page for an empty list', () => {
    const { result } = renderHook(() => useClientPagination([], 10))

    expect(result.current.totalPages).toBe(1)
    expect(result.current.pageItems).toEqual([])
  })
})
