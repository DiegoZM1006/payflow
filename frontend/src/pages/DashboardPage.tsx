import { useState } from 'react'
import DateRangeFilter from '../components/dashboard/DateRangeFilter'
import KpiCards from '../components/dashboard/KpiCards'
import type { DateRange } from '../types/api'

export default function DashboardPage() {
  const [range, setRange] = useState<DateRange>({})

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Volumen transaccional de PayFlow. Filtra por fechas para actualizar todo el tablero.
          </p>
        </div>
        <DateRangeFilter value={range} onChange={setRange} />
      </header>
      <KpiCards range={range} />
    </div>
  )
}
