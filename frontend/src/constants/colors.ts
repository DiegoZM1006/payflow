import type { Status } from './domain'

export const CHART_COLOR = '#4f46e5' // indigo-600

export const STATUS_COLORS: Record<Status, string> = {
  Aprobada: '#16a34a', // green-600
  Rechazada: '#dc2626', // red-600
  Pendiente: '#f59e0b', // amber-500
  Reversada: '#64748b', // slate-500
}
