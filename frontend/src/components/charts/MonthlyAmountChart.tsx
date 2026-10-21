import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART_COLOR } from '../../constants/colors'
import type { MonthlyMetric } from '../../types/api'
import { formatCOP, formatCompactCOP, formatMonth } from '../../utils/format'

interface MonthlyAmountChartProps {
  data: MonthlyMetric[]
}

export default function MonthlyAmountChart({ data }: MonthlyAmountChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatCompactCOP} tick={{ fontSize: 12 }} width={72} />
        <Tooltip
          labelFormatter={(month) => formatMonth(String(month))}
          formatter={(value) => [formatCOP(Number(value)), 'Monto aprobado']}
        />
        <Area
          type="monotone"
          dataKey="approved_amount"
          stroke={CHART_COLOR}
          fill={CHART_COLOR}
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
