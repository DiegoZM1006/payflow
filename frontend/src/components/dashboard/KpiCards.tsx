import { useSummary } from '../../hooks/useMetrics'
import type { DateRange, Summary } from '../../types/api'
import { formatCOP, formatNumber, formatPercent } from '../../utils/format'
import ErrorState from '../ui/ErrorState'
import StatCard from '../ui/StatCard'

const kpis = [
  { label: 'Monto aprobado', getValue: (s: Summary) => formatCOP(s.approved_amount) },
  { label: 'Transacciones', getValue: (s: Summary) => formatNumber(s.total_transactions) },
  { label: 'Ticket promedio', getValue: (s: Summary) => formatCOP(s.average_ticket) },
  { label: 'Tasa de aprobación', getValue: (s: Summary) => formatPercent(s.approval_rate) },
]

interface KpiCardsProps {
  range: DateRange
}

export default function KpiCards({ range }: KpiCardsProps) {
  const { data: summary, isPending, isError, refetch } = useSummary(range)

  if (isError) {
    return <ErrorState message="No pudimos cargar los indicadores." onRetry={() => refetch()} />
  }

  return (
    <section aria-label="Indicadores" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <StatCard
          key={kpi.label}
          label={kpi.label}
          value={summary && kpi.getValue(summary)}
          isLoading={isPending}
        />
      ))}
    </section>
  )
}
