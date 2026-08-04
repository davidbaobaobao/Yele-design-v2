'use client'

import { Plus, X } from 'lucide-react'
import { type ServiceRow } from '../_lib/data'

const MAX_ROWS = 8

export default function ServicesRepeater({
  rows,
  onChange,
}: {
  rows: ServiceRow[]
  onChange: (rows: ServiceRow[]) => void
}) {
  function updateRow(i: number, patch: Partial<ServiceRow>) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  }

  function addRow() {
    if (rows.length >= MAX_ROWS) return
    onChange([...rows, { name: '', price: '' }])
  }

  function removeRow(i: number) {
    onChange(rows.filter((_, idx) => idx !== i))
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={row.name}
            onChange={(e) => updateRow(i, { name: e.target.value })}
            placeholder="Service or product name"
            className="flex-1 rounded-xl border-2 border-ink/30 bg-ink/50 px-4 py-3 font-body text-sm text-white outline-none transition-colors duration-200 placeholder:text-white/60 focus:border-ink"
          />
          <input
            value={row.price}
            onChange={(e) => updateRow(i, { price: e.target.value })}
            placeholder="$50 or from $200/hr"
            className="w-40 rounded-xl border-2 border-white/40 bg-white/10 px-4 py-3 font-body text-sm text-white outline-none transition-colors duration-200 placeholder:text-white/50 focus:border-white"
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            aria-label="Remove row"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      {rows.length < MAX_ROWS && (
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-2 self-start rounded-full bg-ink px-4 py-2 font-body text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" /> Add {rows.length === 0 ? 'a service' : 'another'}
        </button>
      )}
    </div>
  )
}
