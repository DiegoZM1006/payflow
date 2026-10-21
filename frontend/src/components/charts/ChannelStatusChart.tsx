import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { STATUS_COLORS } from '../../constants/colors'
import { STATUSES, type Channel } from '../../constants/domain'
import type { ChannelMetric } from '../../types/api'
import { formatNumber } from '../../utils/format'

const SHORT_LABELS: Record<Channel, string> = {
  'Tarjeta crédito': 'Crédito',
  'Tarjeta débito': 'Débito',
  Transferencia: 'Transfer.',
  'Billetera digital': 'Billetera',
}

interface ChannelStatusChartProps {
  data: ChannelMetric[]
}

export default function ChannelStatusChart({ data }: ChannelStatusChartProps) {
  const rows = data.map((item) => ({ channel: item.channel, ...item.by_status }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="channel"
          interval={0}
          tickFormatter={(channel: Channel) => SHORT_LABELS[channel]}
          tick={{ fontSize: 12 }}
        />
        <YAxis tickFormatter={formatNumber} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => formatNumber(Number(value))} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {STATUSES.map((status) => (
          <Bar key={status} dataKey={status} stackId="status" fill={STATUS_COLORS[status]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
