import Skeleton from './Skeleton'

interface StatCardProps {
  label: string
  value?: string
  isLoading?: boolean
}

export default function StatCard({ label, value, isLoading = false }: StatCardProps) {
  return (
    <div className="rounded-xl bg-surface p-5 shadow-sm ring-1 ring-line">
      <p className="text-sm text-fg-subtle">{label}</p>
      {isLoading ? (
        <Skeleton className="mt-2 h-8 w-3/4" />
      ) : (
        <p className="mt-1 text-xl font-bold text-fg sm:text-2xl">{value}</p>
      )}
    </div>
  )
}
