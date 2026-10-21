import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getTransaction, getTransactions } from '../api/transactions'
import type { TransactionFilters } from '../types/api'

export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => getTransactions(filters),
    placeholderData: keepPreviousData,
  })
}

export function useTransaction(transactionId: string) {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransaction(transactionId),
  })
}
