interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const buttonClassName =
  'rounded-md px-3 py-1.5 text-sm font-medium text-fg-muted ring-1 ring-line-strong hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40'

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="Paginación" className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={buttonClassName}
      >
        Anterior
      </button>
      <span className="text-sm text-fg-muted">
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={buttonClassName}
      >
        Siguiente
      </button>
    </nav>
  )
}
