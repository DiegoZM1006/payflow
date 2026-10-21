import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART_COLOR } from '../../constants/colors'
import type { CategoryMetric } from '../../types/api'
import { formatCOP, formatCompactCOP } from '../../utils/format'

interface CategoryAmountChartProps {
  data: CategoryMetric[]
}

export default function CategoryAmountChart({ data }: CategoryAmountChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickFormatter={formatCompactCOP} tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="category" width={120} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value, _name, item) => [
            `${formatCOP(Number(value))} (${item.payload.share} %)`,
            'Monto aprobado',
          ]}
        />
        <Bar dataKey="approved_amount" fill={CHART_COLOR} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
