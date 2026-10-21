import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { CATEGORIES, CHANNELS, CITIES, STATUSES } from '../constants/domain'
import type { TransactionFilters } from '../types/api'

export const PAGE_SIZES = [10, 20, 50]
export const DEFAULT_PAGE_SIZE = 20
export const ORDERINGS = ['-created_at', 'created_at', '-amount', 'amount'] as const
export const DEFAULT_ORDERING = '-created_at'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function parseOption<T extends string>(value: string | null, options: readonly T[]) {
  return options.find((option) => option === value)
}

function parsePositiveInt(value: string | null, fallback: number) {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : fallback
}

function parseDate(value: string | null) {
  return value && DATE_PATTERN.test(value) ? value : undefined
}

function parseFilters(params: URLSearchParams): TransactionFilters {
  const pageSize = parsePositiveInt(params.get('page_size'), DEFAULT_PAGE_SIZE)
  return {
    page: parsePositiveInt(params.get('page'), 1),
    page_size: PAGE_SIZES.includes(pageSize) ? pageSize : DEFAULT_PAGE_SIZE,
    status: parseOption(params.get('status'), STATUSES),
    channel: parseOption(params.get('channel'), CHANNELS),
    category: parseOption(params.get('category'), CATEGORIES),
    city: parseOption(params.get('city'), CITIES),
    date_from: parseDate(params.get('date_from')),
    date_to: parseDate(params.get('date_to')),
    search: params.get('search') || undefined,
    ordering: parseOption(params.get('ordering'), ORDERINGS),
  }
}

function toSearchParams(filters: TransactionFilters) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    const isDefault =
      (key === 'page' && value === 1) || (key === 'page_size' && value === DEFAULT_PAGE_SIZE)
    if (value !== undefined && value !== '' && !isDefault) {
      params.set(key, String(value))
    }
  }
  return params
}

export function useTransactionsUrlState() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => parseFilters(searchParams), [searchParams])
  const detailId = searchParams.get('detail') ?? undefined

  function updateFilters(changes: Partial<TransactionFilters>) {
    setSearchParams(toSearchParams({ ...filters, page: 1, ...changes }))
  }

  function clearFilters() {
    setSearchParams({})
  }

  function openDetail(transactionId: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set('detail', transactionId)
      return next
    })
  }

  function closeDetail() {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.delete('detail')
      return next
    })
  }

  return { filters, updateFilters, clearFilters, detailId, openDetail, closeDetail }
}
