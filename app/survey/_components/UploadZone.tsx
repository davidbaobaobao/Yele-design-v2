'use client'

import { useRef, useState } from 'react'
import { ImageUp, Loader2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const MAX_SIZE_BYTES = 10 * 1024 * 1024

interface UploadZoneProps {
  sessionId: string
  folder: 'logo' | 'photos'
  accept: string
  maxFiles: number
  urls: string[]
  onChange: (urls: string[]) => void
  label: string
  disabled?: boolean
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
}

export default function UploadZone({ sessionId, folder, accept, maxFiles, urls, onChange, label, disabled }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setError('')

    const files = Array.from(fileList)
    const remainingSlots = maxFiles - urls.length
    if (remainingSlots <= 0) {
      setError(`You can upload up to ${maxFiles} file${maxFiles > 1 ? 's' : ''}.`)
      return
    }

    const toUpload = files.slice(0, remainingSlots)
    setUploading(true)

    const uploaded: string[] = []
    for (const file of toUpload) {
      if (file.size > MAX_SIZE_BYTES) {
        setError(`${file.name} is over 10MB — skipped.`)
        continue
      }
      const path = `${sessionId}/${folder}/${Date.now()}-${sanitizeName(file.name)}`
      const { error: uploadError } = await supabase.storage.from('survey-uploads').upload(path, file, {
        upsert: false,
        contentType: file.type || undefined,
      })
      if (uploadError) {
        setError(`Couldn't upload ${file.name}.`)
        continue
      }
      const { data } = supabase.storage.from('survey-uploads').getPublicUrl(path)
      uploaded.push(data.publicUrl)
    }

    if (uploaded.length > 0) onChange([...urls, ...uploaded])
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function removeAt(i: number) {
    onChange(urls.filter((_, idx) => idx !== i))
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled || uploading || urls.length >= maxFiles}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading || urls.length >= maxFiles}
        className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/40 bg-white/10 px-4 py-6 font-body text-sm font-semibold text-white transition-colors duration-200 hover:border-white/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}
        {uploading ? 'Uploading…' : label}
      </button>

      {error && <p className="text-xs font-semibold text-white">{error}</p>}

      {urls.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {urls.map((url, i) => (
            <li
              key={url}
              className="flex items-center justify-between gap-2 rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-xs text-white"
            >
              <span className="truncate">{decodeURIComponent(url.split('/').pop() ?? url)}</span>
              <button type="button" onClick={() => removeAt(i)} aria-label="Remove file" className="shrink-0 text-white/70 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
