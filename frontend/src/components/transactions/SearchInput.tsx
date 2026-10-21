import { useEffect, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  const [text, setText] = useState(value)
  const debouncedText = useDebounce(text, 400)

  const [syncedValue, setSyncedValue] = useState(value)
  if (value !== syncedValue) {
    setSyncedValue(value)
    setText(value)
  }

  useEffect(() => {
    if (debouncedText === text && debouncedText !== value) {
      onChange(debouncedText)
    }
  }, [debouncedText, text, value, onChange])

  return (
    <label className="flex flex-col gap-1 text-sm text-fg-muted">
      Buscar
      <input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="ID, cliente o comercio"
        className="rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-fg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
      />
    </label>
  )
}
