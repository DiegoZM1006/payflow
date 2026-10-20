import type { AmountRange, Category, Channel, City, Status } from '../constants/domain'

export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  total_pages: number
  results: T[]
}

export interface Transaction {
  transaction_id: string
  created_at: string
  customer_id: string
  customer_name: string
  customer_type: string
  city: City
  merchant: string
  category: Category
  channel: Channel
  amount: number
  amount_range: AmountRange
  currency: string
  installments: number
  status: Status
  weekday: string
}

export interface DateRange {
  date_from?: string
  date_to?: string
}

export interface TransactionFilters extends DateRange {
  status?: Status
  channel?: Channel
  category?: Category
  city?: City
  search?: string
  ordering?: string
  page?: number
  page_size?: number
}

export interface Summary {
  approved_amount: number
  total_transactions: number
  average_ticket: number
  approval_rate: number
  unique_customers: number
}

export interface MonthlyMetric {
  month: string
  approved_amount: number
  total_transactions: number
  approval_rate: number
}

export interface CategoryMetric {
  category: Category
  total_transactions: number
  approved_amount: number
  share: number
}

export interface ChannelMetric {
  channel: Channel
  total_transactions: number
  by_status: Record<Status, number>
}

export interface TopCustomer {
  customer_id: string
  customer_name: string
  approved_amount: number
  total_transactions: number
  last_purchase_at: string | null
}
