import { PAGE_SIZES } from '../../hooks/useTransactionsUrlState'
import { formatNumber } from '../../utils/format'
import Pagination from '../ui/Pagination'

interface TransactionsFooterProps {
  count: number
  page: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export default function TransactionsFooter({
  count,
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TransactionsFooterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4 text-sm text-fg-muted">
        <span>
          <strong className="text-fg">{formatNumber(count)}</strong> resultados
        </span>
        <label className="flex items-center gap-2">
          Mostrar
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-md border border-line-strong bg-surface px-2 py-1 text-sm"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  )
}
