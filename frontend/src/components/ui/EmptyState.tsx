interface EmptyStateProps {
  message: string
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-line-strong p-6 text-center text-sm text-fg-subtle">
      {message}
    </div>
  )
}
