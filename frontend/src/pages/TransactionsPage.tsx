import { isAxiosError } from 'axios'
import { Download } from 'lucide-react'
import { getExportUrl } from '../api/transactions'
import TransactionDetailModal from '../components/transactions/TransactionDetailModal'
import TransactionFiltersBar from '../components/transactions/TransactionFiltersBar'
import TransactionsFooter from '../components/transactions/TransactionsFooter'
import TransactionsTable from '../components/transactions/TransactionsTable'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import Skeleton from '../components/ui/Skeleton'
import { useTransactions } from '../hooks/useTransactions'
import { DEFAULT_PAGE_SIZE, useTransactionsUrlState } from '../hooks/useTransactionsUrlState'

export default function TransactionsPage() {
  const { filters, updateFilters, clearFilters, detailId, openDetail, closeDetail } =
    useTransactionsUrlState()
  const { data, isPending, isError, error, isFetching, isPlaceholderData, refetch } =
    useTransactions(filters)

  // The backend answers 404 when the page in the URL no longer exists
  const isInvalidPage = isAxiosError(error) && error.response?.status === 404

  function renderResults() {
    if (isPending) return <Skeleton className="h-96 w-full" />
    if (isInvalidPage) {
      return (
        <div className="space-y-3 text-center">
          <EmptyState message="Esa página ya no existe para los filtros actuales." />
          <button
            type="button"
            onClick={() => updateFilters({ page: 1 })}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Ir a la primera página
          </button>
        </div>
      )
    }
    if (isError) {
      return <ErrorState message="No pudimos cargar las transacciones." onRetry={() => refetch()} />
    }
    if (data.count === 0) {
      return <EmptyState message="No hay transacciones que coincidan con los filtros." />
    }
    return (
      <div className="space-y-4">
        <div
          aria-busy={isFetching}
          className={isFetching && isPlaceholderData ? 'opacity-60 transition-opacity' : ''}
        >
          <TransactionsTable
            transactions={data.results}
            ordering={filters.ordering}
            onOrderingChange={(ordering) => updateFilters({ ordering })}
            onSelect={openDetail}
          />
        </div>
        <TransactionsFooter
          count={data.count}
          page={filters.page ?? 1}
          totalPages={data.total_pages}
          pageSize={filters.page_size ?? DEFAULT_PAGE_SIZE}
          onPageChange={(page) => updateFilters({ page })}
          onPageSizeChange={(page_size) => updateFilters({ page_size })}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Transacciones</h1>
          <p className="mt-1 text-sm text-slate-500">
            Paginación en el servidor: cada cambio de página, filtro u orden pide datos nuevos.
          </p>
        </div>
        <a
          href={getExportUrl(filters)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <Download aria-hidden="true" className="size-4" />
          Exportar CSV
        </a>
      </header>

      <TransactionFiltersBar filters={filters} onChange={updateFilters} onClear={clearFilters} />

      <section
        aria-label="Resultados"
        className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
      >
        {renderResults()}
      </section>

      {detailId && (
        <TransactionDetailModal key={detailId} transactionId={detailId} onClose={closeDetail} />
      )}
    </div>
  )
}
