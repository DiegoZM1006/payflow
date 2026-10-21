import { useSummary } from '../../hooks/useMetrics'
import type { Summary } from '../../types/api'
import { formatCOP, formatNumber, formatPercent } from '../../utils/format'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import StatCard from '../ui/StatCard'

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
        <StatCard
          key={stat.label}
          label={stat.label}
          value={summary && stat.getValue(summary)}
          isLoading={isPending}
        />
      ))}
    </section>
  )
}
