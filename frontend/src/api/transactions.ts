import type { Paginated, Transaction, TransactionFilters } from '../types/api'
import { API_URL, apiClient } from './client'

export async function getTransactions(
  filters: TransactionFilters,
): Promise<Paginated<Transaction>> {
  const { data } = await apiClient.get<Paginated<Transaction>>('/transactions/', {
    params: filters,
  })
  return data
}

export async function getTransaction(transactionId: string): Promise<Transaction> {
  const { data } = await apiClient.get<Transaction>(`/transactions/${transactionId}/`)
  return data
}

export function getExportUrl(filters: TransactionFilters): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '' && key !== 'page' && key !== 'page_size') {
      params.set(key, String(value))
    }
  }
  return `${API_URL}/transactions/export/?${params}`
}
