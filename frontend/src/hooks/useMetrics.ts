import { useQuery } from '@tanstack/react-query'
import {
  getByCategory,
  getByChannel,
  getMonthly,
  getSummary,
  getTopCustomers,
} from '../api/metrics'
import type { DateRange } from '../types/api'

export function useSummary(range: DateRange = {}) {
  return useQuery({
    queryKey: ['metrics', 'summary', range],
    queryFn: () => getSummary(range),
  })
}

export function useMonthly(range: DateRange = {}) {
  return useQuery({
    queryKey: ['metrics', 'monthly', range],
    queryFn: () => getMonthly(range),
  })
}

export function useByCategory(range: DateRange = {}) {
  return useQuery({
    queryKey: ['metrics', 'by-category', range],
    queryFn: () => getByCategory(range),
  })
}

export function useByChannel(range: DateRange = {}) {
  return useQuery({
    queryKey: ['metrics', 'by-channel', range],
    queryFn: () => getByChannel(range),
  })
}

export function useTopCustomers(range: DateRange = {}) {
  return useQuery({
    queryKey: ['metrics', 'top-customers', range],
    queryFn: () => getTopCustomers(range),
  })
}
