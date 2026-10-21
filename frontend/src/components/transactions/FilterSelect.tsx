interface FilterSelectProps<T extends string> {
  label: string
  value: T | undefined
  options: readonly T[]
  onChange: (value: T | undefined) => void
}

export default function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps<T>) {
  return (
    <label className="flex flex-col gap-1 text-sm text-fg-muted">
      {label}
      <select
        value={value ?? ''}
        onChange={(event) => onChange((event.target.value as T) || undefined)}
        className="rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-fg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
      >
        <option value="">Todos</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
