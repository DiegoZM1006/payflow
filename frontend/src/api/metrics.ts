import type {
  CategoryMetric,
  ChannelMetric,
  DateRange,
  MonthlyMetric,
  Summary,
  TopCustomer,
} from '../types/api'
import { apiClient } from './client'

async function getMetric<T>(path: string, range: DateRange): Promise<T> {
  const { data } = await apiClient.get<T>(`/metrics/${path}/`, { params: range })
  return data
}

export const getSummary = (range: DateRange = {}) => getMetric<Summary>('summary', range)

export const getMonthly = (range: DateRange = {}) =>
  getMetric<MonthlyMetric[]>('monthly', range)

export const getByCategory = (range: DateRange = {}) =>
  getMetric<CategoryMetric[]>('by-category', range)

export const getByChannel = (range: DateRange = {}) =>
  getMetric<ChannelMetric[]>('by-channel', range)

export const getTopCustomers = (range: DateRange = {}) =>
  getMetric<TopCustomer[]>('top-customers', range)
