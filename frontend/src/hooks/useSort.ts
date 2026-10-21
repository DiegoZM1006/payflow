import { useMemo, useState } from 'react'

export type SortDirection = 'asc' | 'desc'

export interface SortState<K> {
  key: K
  direction: SortDirection
}

function compare(a: unknown, b: unknown) {
  if (a === b) return 0
  if (a === null || a === undefined) return 1
  if (b === null || b === undefined) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), 'es')
}

export function useSort<T, K extends keyof T>(items: T[], initialSort: SortState<K>) {
  const [sort, setSort] = useState(initialSort)

  const sortedItems = useMemo(() => {
    const factor = sort.direction === 'asc' ? 1 : -1
    return [...items].sort((a, b) => factor * compare(a[sort.key], b[sort.key]))
  }, [items, sort])

  // Clicking the active column flips the direction; a new column starts with `firstDirection`
  function toggleSort(key: K, firstDirection: SortDirection = 'desc') {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: firstDirection },
    )
  }

  return { sortedItems, sort, toggleSort }
}
