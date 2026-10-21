import { useSummary } from '../../hooks/useMetrics'
import type { Summary } from '../../types/api'
import { formatCOP, formatNumber, formatPercent } from '../../utils/format'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import Skeleton from '../ui/Skeleton'

const stats = [
  { label: 'Monto aprobado', getValue: (s: Summary) => formatCOP(s.approved_amount) },
  { label: 'Transacciones', getValue: (s: Summary) => formatNumber(s.total_transactions) },
  { label: 'Tasa de aprobación', getValue: (s: Summary) => formatPercent(s.approval_rate) },
  { label: 'Clientes únicos', getValue: (s: Summary) => formatNumber(s.unique_customers) },
]

export default function StatsStrip() {
  const { data: summary, isPending, isError, refetch } = useSummary()

  if (isError) {
    return <ErrorState message="No pudimos cargar las cifras." onRetry={() => refetch()} />
  }
  if (!isPending && summary.total_transactions === 0) {
    return <EmptyState message="Aún no hay transacciones cargadas." />
  }

  return (
    <section aria-label="Cifras principales" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">{stat.label}</p>
          {isPending ? (
            <Skeleton className="mt-2 h-8 w-3/4" />
          ) : (
            <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
              {stat.getValue(summary)}
            </p>
          )}
        </div>
      ))}
    </section>
  )
}
