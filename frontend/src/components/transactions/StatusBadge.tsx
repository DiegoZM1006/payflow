import type { Status } from '../../constants/domain'

const STATUS_STYLES: Record<Status, string> = {
  Aprobada: 'bg-green-100 text-green-800',
  Rechazada: 'bg-red-100 text-red-800',
  Pendiente: 'bg-amber-100 text-amber-800',
  Reversada: 'bg-slate-200 text-slate-700',
}

interface StatusBadgeProps {
  status: Status
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}
