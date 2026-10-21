import type { DateRange } from '../../types/api'

interface DateRangeFilterProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

const inputClassName =
  'rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-fg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const hasRange = Boolean(value.date_from || value.date_to)

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm text-fg-muted">
        Desde
        <input
          type="date"
          value={value.date_from ?? ''}
          max={value.date_to}
          onChange={(event) => onChange({ ...value, date_from: event.target.value || undefined })}
          className={inputClassName}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-fg-muted">
        Hasta
        <input
          type="date"
          value={value.date_to ?? ''}
          min={value.date_from}
          onChange={(event) => onChange({ ...value, date_to: event.target.value || undefined })}
          className={inputClassName}
        />
      </label>
      {hasRange && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="rounded-md px-3 py-2 text-sm font-medium text-accent hover:bg-accent-soft"
        >
          Limpiar
        </button>
      )}
    </div>
  )
}
