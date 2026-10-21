import type { ReactNode } from 'react'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import Skeleton from '../ui/Skeleton'

interface ChartCardProps {
  title: string
  isPending: boolean
  isError: boolean
  isEmpty: boolean
  onRetry: () => void
  children: ReactNode
}

export default function ChartCard({
  title,
  isPending,
  isError,
  isEmpty,
  onRetry,
  children,
}: ChartCardProps) {
  let content = children
  if (isPending) {
    content = <Skeleton className="h-full w-full" />
  } else if (isError) {
    content = <ErrorState message="No pudimos cargar la gráfica." onRetry={onRetry} />
  } else if (isEmpty) {
    content = <EmptyState message="No hay datos para el rango seleccionado." />
  }

  return (
    <section className="rounded-xl bg-surface p-5 shadow-sm ring-1 ring-line">
      <h2 className="font-semibold text-fg">{title}</h2>
      <div className="mt-4 h-72">{content}</div>
    </section>
  )
}
