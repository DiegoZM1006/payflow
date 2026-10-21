import type { Status } from '../../constants/domain'

const STATUS_STYLES: Record<Status, string> = {
  Aprobada: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300',
  Rechazada: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
  Pendiente: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  Reversada: 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
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
