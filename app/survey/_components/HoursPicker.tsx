'use client'

import { DAY_KEYS, DAY_LABELS, HOURS_PRESETS, type HoursAnswers } from '../_lib/data'

export default function HoursPicker({
  hours,
  onChange,
}: {
  hours: HoursAnswers
  onChange: (hours: HoursAnswers) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {HOURS_PRESETS.map((p) => {
          const selected = hours.mode === 'preset' && hours.preset === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange({ ...hours, mode: 'preset', preset: p.id })}
              className={`rounded-xl border-2 px-4 py-3 text-left font-body text-sm font-semibold transition-colors duration-200 ${
                selected ? 'border-ink bg-ink text-white' : 'border-ink/30 bg-ink/50 text-white hover:border-ink/50 hover:bg-ink/60'
              }`}
            >
              {p.label}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => onChange({ ...hours, mode: 'custom' })}
          className={`rounded-xl border-2 px-4 py-3 text-left font-body text-sm font-semibold transition-colors duration-200 ${
            hours.mode === 'custom' ? 'border-ink bg-ink text-white' : 'border-ink/30 bg-ink/50 text-white hover:border-ink/50 hover:bg-ink/60'
          }`}
        >
          Custom hours
        </button>
      </div>

      {hours.mode === 'custom' && (
        <div className="flex flex-col gap-2 rounded-xl border-2 border-ink/25 bg-ink/40 p-4">
          {DAY_KEYS.map((day) => {
            const d = hours.custom[day]
            return (
              <div key={day} className="flex flex-wrap items-center gap-3">
                <span className="w-10 font-body text-sm font-semibold text-white">{DAY_LABELS[day]}</span>
                <label className="flex items-center gap-1.5 text-xs text-white/85">
                  <input
                    type="checkbox"
                    checked={d.closed}
                    onChange={(e) =>
                      onChange({ ...hours, custom: { ...hours.custom, [day]: { ...d, closed: e.target.checked } } })
                    }
                    className="h-3.5 w-3.5 accent-ink"
                  />
                  Closed
                </label>
                {!d.closed && (
                  <>
                    <input
                      type="time"
                      value={d.open}
                      onChange={(e) =>
                        onChange({ ...hours, custom: { ...hours.custom, [day]: { ...d, open: e.target.value } } })
                      }
                      className="rounded-lg border border-ink/30 bg-ink/50 px-2 py-1 text-sm text-white outline-none focus:border-ink [color-scheme:dark]"
                    />
                    <span className="text-white/70">–</span>
                    <input
                      type="time"
                      value={d.close}
                      onChange={(e) =>
                        onChange({ ...hours, custom: { ...hours.custom, [day]: { ...d, close: e.target.value } } })
                      }
                      className="rounded-lg border border-ink/30 bg-ink/50 px-2 py-1 text-sm text-white outline-none focus:border-ink [color-scheme:dark]"
                    />
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
