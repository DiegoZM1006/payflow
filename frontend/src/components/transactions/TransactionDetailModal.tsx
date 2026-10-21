import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTransaction } from '../../hooks/useTransactions'
import type { Transaction } from '../../types/api'
import { formatCOP, formatDateTime } from '../../utils/format'
import ErrorState from '../ui/ErrorState'
import Skeleton from '../ui/Skeleton'
import StatusBadge from './StatusBadge'

interface TransactionDetailModalProps {
  transactionId: string
  onClose: () => void
}

function getDetails(transaction: Transaction) {
  return [
    { label: 'Fecha', value: formatDateTime(transaction.created_at) },
    { label: 'Día', value: transaction.weekday },
    { label: 'Cliente', value: `${transaction.customer_name} (${transaction.customer_id})` },
    { label: 'Tipo de cliente', value: transaction.customer_type },
    { label: 'Ciudad', value: transaction.city },
    { label: 'Comercio', value: transaction.merchant },
    { label: 'Categoría', value: transaction.category },
    { label: 'Canal', value: transaction.channel },
    { label: 'Cuotas', value: String(transaction.installments) },
    { label: 'Rango de monto', value: transaction.amount_range },
  ]
}

export default function TransactionDetailModal({
  transactionId,
  onClose,
}: TransactionDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { data: transaction, isPending, isError, refetch } = useTransaction(transactionId)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop targets the <dialog> element itself
        if (event.target === dialogRef.current) dialogRef.current.close()
      }}
      aria-labelledby="transaction-detail-title"
      className="m-auto w-full max-w-lg rounded-xl p-0 shadow-xl backdrop:bg-slate-900/50"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Detalle de la transacción</p>
            <h2 id="transaction-detail-title" className="text-xl font-bold text-slate-900">
              {transactionId}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Cerrar"
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="mt-6">
          {isPending ? (
            <Skeleton className="h-72 w-full" />
          ) : isError ? (
            <ErrorState message="No pudimos cargar la transacción." onRetry={() => refetch()} />
          ) : (
            <>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <p className="text-2xl font-bold text-slate-900 tabular-nums">
                  {formatCOP(transaction.amount)}
                </p>
                <StatusBadge status={transaction.status} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {getDetails(transaction).map((detail) => (
                  <div key={detail.label}>
                    <dt className="text-slate-500">{detail.label}</dt>
                    <dd className="font-medium text-slate-900">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>
      </div>
    </dialog>
  )
}
