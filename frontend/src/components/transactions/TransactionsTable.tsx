import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { DEFAULT_ORDERING } from '../../hooks/useTransactionsUrlState'
import type { Transaction } from '../../types/api'
import { formatCOP, formatDateTime } from '../../utils/format'
import StatusBadge from './StatusBadge'

type SortField = 'created_at' | 'amount'

interface SortButtonProps {
  label: string
  isActive: boolean
  isDescending: boolean
  onClick: () => void
}

function SortButton({ label, isActive, isDescending, onClick }: SortButtonProps) {
  const Icon = !isActive ? ArrowUpDown : isDescending ? ArrowDown : ArrowUp
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 hover:text-fg"
    >
      {label}
      <Icon aria-hidden="true" className="size-3.5" />
    </button>
  )
}

interface TransactionsTableProps {
  transactions: Transaction[]
  ordering: string | undefined
  onOrderingChange: (ordering: string) => void
  onSelect: (transactionId: string) => void
}

export default function TransactionsTable({
  transactions,
  ordering = DEFAULT_ORDERING,
  onOrderingChange,
  onSelect,
}: TransactionsTableProps) {
  // "-amount" → sorted by amount, descending
  const sortField = ordering.replace('-', '')
  const isDescending = ordering.startsWith('-')

  function handleSort(field: SortField) {
    const isActive = sortField === field
    onOrderingChange(isActive && isDescending ? field : `-${field}`)
  }

  function ariaSort(field: SortField) {
    if (sortField !== field) return 'none'
    return isDescending ? 'descending' : 'ascending'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-200 text-sm">
        <thead>
          <tr className="border-b border-line text-left text-fg-subtle">
            <th scope="col" className="py-2 font-medium">
              ID
            </th>
            <th scope="col" aria-sort={ariaSort('created_at')} className="py-2 font-medium">
              <SortButton
                label="Fecha"
                isActive={sortField === 'created_at'}
                isDescending={isDescending}
                onClick={() => handleSort('created_at')}
              />
            </th>
            <th scope="col" className="py-2 font-medium">
              Cliente
            </th>
            <th scope="col" className="py-2 font-medium">
              Comercio
            </th>
            <th scope="col" className="py-2 font-medium">
              Canal
            </th>
            <th scope="col" aria-sort={ariaSort('amount')} className="py-2 text-right font-medium">
              <SortButton
                label="Monto"
                isActive={sortField === 'amount'}
                isDescending={isDescending}
                onClick={() => handleSort('amount')}
              />
            </th>
            <th scope="col" className="py-2 pl-4 font-medium">
              Estado
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.transaction_id}
              onClick={() => onSelect(transaction.transaction_id)}
              className="cursor-pointer border-b border-line hover:bg-surface-muted"
            >
              <td className="py-2.5">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onSelect(transaction.transaction_id)
                  }}
                  className="font-medium text-accent hover:underline"
                >
                  {transaction.transaction_id}
                </button>
              </td>
              <td className="py-2.5 whitespace-nowrap">{formatDateTime(transaction.created_at)}</td>
              <td className="py-2.5">{transaction.customer_name}</td>
              <td className="py-2.5">
                <p>{transaction.merchant}</p>
                <p className="text-xs text-fg-subtle">{transaction.category}</p>
              </td>
              <td className="py-2.5">{transaction.channel}</td>
              <td className="py-2.5 text-right whitespace-nowrap tabular-nums">
                {formatCOP(transaction.amount)}
              </td>
              <td className="py-2.5 pl-4">
                <StatusBadge status={transaction.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
