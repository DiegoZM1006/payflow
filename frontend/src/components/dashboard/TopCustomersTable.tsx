import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useClientPagination } from '../../hooks/useClientPagination'
import { useTopCustomers } from '../../hooks/useMetrics'
import { useSort, type SortDirection, type SortState } from '../../hooks/useSort'
import type { DateRange, TopCustomer } from '../../types/api'
import { formatCOP, formatDate, formatNumber } from '../../utils/format'
import { normalizeText } from '../../utils/text'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import Pagination from '../ui/Pagination'
import Skeleton from '../ui/Skeleton'

const PAGE_SIZE = 10

type SortKey = 'customer_name' | 'approved_amount' | 'total_transactions' | 'last_purchase_at'

interface Column {
  key: SortKey
  label: string
  align: 'left' | 'right'
  firstDirection: SortDirection
}

const columns: Column[] = [
  { key: 'customer_name', label: 'Cliente', align: 'left', firstDirection: 'asc' },
  { key: 'approved_amount', label: 'Monto aprobado', align: 'right', firstDirection: 'desc' },
  { key: 'total_transactions', label: 'Transacciones', align: 'right', firstDirection: 'desc' },
  { key: 'last_purchase_at', label: 'Última compra', align: 'right', firstDirection: 'desc' },
]

const INITIAL_SORT: SortState<SortKey> = { key: 'approved_amount', direction: 'desc' }

interface TopCustomersTableProps {
  range: DateRange
}

export default function TopCustomersTable({ range }: TopCustomersTableProps) {
  const { data, isPending, isError, refetch } = useTopCustomers(range)
  const [search, setSearch] = useState('')

  const filteredCustomers = useMemo(() => {
    const query = normalizeText(search.trim())
    const customers = data ?? []
    return query
      ? customers.filter((customer) => normalizeText(customer.customer_name).includes(query))
      : customers
  }, [data, search])

  const { sortedItems, sort, toggleSort } = useSort<TopCustomer, SortKey>(
    filteredCustomers,
    INITIAL_SORT,
  )
  const { page, totalPages, pageItems, setPage } = useClientPagination(sortedItems, PAGE_SIZE)

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleSort(column: Column) {
    toggleSort(column.key, column.firstDirection)
    setPage(1)
  }

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Top clientes</h2>
          <p className="text-sm text-slate-500">
            {formatNumber(filteredCustomers.length)} clientes · ordenados y paginados
          </p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Buscar por nombre"
          aria-label="Buscar cliente por nombre"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-64"
        />
      </div>

      <div className="mt-4">
        {isPending ? (
          <Skeleton className="h-96 w-full" />
        ) : isError ? (
          <ErrorState message="No pudimos cargar los clientes." onRetry={() => refetch()} />
        ) : filteredCustomers.length === 0 ? (
          <EmptyState message="No hay clientes que coincidan con la búsqueda." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-140 text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    {columns.map((column) => {
                      const isSorted = sort.key === column.key
                      const SortIcon = !isSorted
                        ? ArrowUpDown
                        : sort.direction === 'asc'
                          ? ArrowUp
                          : ArrowDown
                      return (
                        <th
                          key={column.key}
                          scope="col"
                          aria-sort={
                            isSorted
                              ? sort.direction === 'asc'
                                ? 'ascending'
                                : 'descending'
                              : 'none'
                          }
                          className={`py-2 font-medium ${column.align === 'right' ? 'text-right' : 'text-left'}`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSort(column)}
                            className="inline-flex items-center gap-1 hover:text-slate-900"
                          >
                            {column.label}
                            <SortIcon aria-hidden="true" className="size-3.5" />
                          </button>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((customer) => (
                    <tr key={customer.customer_id} className="border-b border-slate-100">
                      <td className="py-2.5">
                        <p className="font-medium text-slate-900">{customer.customer_name}</p>
                        <p className="text-xs text-slate-500">{customer.customer_id}</p>
                      </td>
                      <td className="py-2.5 text-right tabular-nums">
                        {formatCOP(customer.approved_amount)}
                      </td>
                      <td className="py-2.5 text-right tabular-nums">
                        {formatNumber(customer.total_transactions)}
                      </td>
                      <td className="py-2.5 text-right">
                        {customer.last_purchase_at ? formatDate(customer.last_purchase_at) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
