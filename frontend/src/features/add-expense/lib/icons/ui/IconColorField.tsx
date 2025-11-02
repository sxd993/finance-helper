import { useIconPicker } from "../model/useIconPicker"
import { HexColorPicker } from "react-colorful"
import { useEffect, useState } from "react"

export const IconColorField = () => {
  const { iconColor, handleColorChange } = useIconPicker()
  const [inputValue, setInputValue] = useState(iconColor)

  useEffect(() => {
    setInputValue(iconColor)
  }, [iconColor])

  const tryCommitHex = (raw: string) => {
    const v = raw.trim()
    const normalized = v.startsWith("#") ? v : `#${v}`
    const valid = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized)
    if (valid) {
      handleColorChange({ target: { value: normalized } } as any)
      return true
    }
    return false
  }


  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">Цвет иконки</label>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mx-auto">
        <div className="mb-3 flex flex-wrap gap-2">
        </div>
        <HexColorPicker
          color={iconColor}
          onChange={(val) => handleColorChange({ target: { value: val } } as any)}
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase text-slate-400">Hex</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-2 top-1.5 text-slate-400">#</span>
              <input
                type="text"
                inputMode="text"
                spellCheck={false}
                value={inputValue.replace(/^#/, "")}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={(e) => {
                  // try commit on blur; if invalid, revert to current store value
                  if (!tryCommitHex(e.target.value)) {
                    setInputValue(iconColor)
                  }
                }}
                placeholder="000000"
                className="w-28 rounded-md border border-slate-200 bg-white pl-5 pr-2 py-1.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
