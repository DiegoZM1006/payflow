import { useQuery } from '@tanstack/react-query'
import { getSummary } from '../api/metrics'
import type { DateRange } from '../types/api'

export function useSummary(range: DateRange = {}) {
  return useQuery({
    queryKey: ['metrics', 'summary', range],
    queryFn: () => getSummary(range),
  })
}
