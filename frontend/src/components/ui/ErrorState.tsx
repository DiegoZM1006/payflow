interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  message = 'No pudimos cargar la información.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
    >
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-white px-3 py-1.5 font-medium text-red-700 ring-1 ring-red-200 hover:bg-red-100"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
