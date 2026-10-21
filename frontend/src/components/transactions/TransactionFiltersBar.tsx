import { CATEGORIES, CHANNELS, CITIES, STATUSES } from '../../constants/domain'
import type { TransactionFilters } from '../../types/api'
import DateRangeFilter from '../dashboard/DateRangeFilter'
import FilterSelect from './FilterSelect'
import SearchInput from './SearchInput'

interface TransactionFiltersBarProps {
  filters: TransactionFilters
  onChange: (changes: Partial<TransactionFilters>) => void
  onClear: () => void
}

export default function TransactionFiltersBar({
  filters,
  onChange,
  onClear,
}: TransactionFiltersBarProps) {
  return (
    <section
      aria-label="Filtros"
      className="space-y-4 rounded-xl bg-surface p-5 shadow-sm ring-1 ring-line"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SearchInput value={filters.search ?? ''} onChange={(search) => onChange({ search })} />
        <FilterSelect
          label="Estado"
          value={filters.status}
          options={STATUSES}
          onChange={(status) => onChange({ status })}
        />
        <FilterSelect
          label="Canal"
          value={filters.channel}
          options={CHANNELS}
          onChange={(channel) => onChange({ channel })}
        />
        <FilterSelect
          label="Categoría"
          value={filters.category}
          options={CATEGORIES}
          onChange={(category) => onChange({ category })}
        />
        <FilterSelect
          label="Ciudad"
          value={filters.city}
          options={CITIES}
          onChange={(city) => onChange({ city })}
        />
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <DateRangeFilter
          value={{ date_from: filters.date_from, date_to: filters.date_to }}
          onChange={({ date_from, date_to }) => onChange({ date_from, date_to })}
        />
        <button
          type="button"
          onClick={onClear}
          className="rounded-md px-3 py-2 text-sm font-medium text-fg-muted ring-1 ring-line-strong hover:bg-surface-muted"
        >
          Limpiar filtros
        </button>
      </div>
    </section>
  )
}
