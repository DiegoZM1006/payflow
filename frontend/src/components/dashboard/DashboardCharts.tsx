import { useByCategory, useByChannel, useMonthly } from '../../hooks/useMetrics'
import type { DateRange } from '../../types/api'
import CategoryAmountChart from '../charts/CategoryAmountChart'
import ChannelStatusChart from '../charts/ChannelStatusChart'
import MonthlyAmountChart from '../charts/MonthlyAmountChart'
import ChartCard from './ChartCard'

interface DashboardChartsProps {
  range: DateRange
}

export default function DashboardCharts({ range }: DashboardChartsProps) {
  const monthly = useMonthly(range)
  const byCategory = useByCategory(range)
  const byChannel = useByChannel(range)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <ChartCard
          title="Evolución mensual del monto aprobado"
          isPending={monthly.isPending}
          isError={monthly.isError}
          isEmpty={monthly.data?.length === 0}
          onRetry={() => monthly.refetch()}
        >
          {monthly.data && <MonthlyAmountChart data={monthly.data} />}
        </ChartCard>
      </div>
      <ChartCard
        title="Monto aprobado por categoría"
        isPending={byCategory.isPending}
        isError={byCategory.isError}
        isEmpty={byCategory.data?.length === 0}
        onRetry={() => byCategory.refetch()}
      >
        {byCategory.data && <CategoryAmountChart data={byCategory.data} />}
      </ChartCard>
      <ChartCard
        title="Transacciones por canal y estado"
        isPending={byChannel.isPending}
        isError={byChannel.isError}
        isEmpty={byChannel.data?.length === 0}
        onRetry={() => byChannel.refetch()}
      >
        {byChannel.data && <ChannelStatusChart data={byChannel.data} />}
      </ChartCard>
    </div>
  )
}
