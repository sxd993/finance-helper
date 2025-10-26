import { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { UseFormRegister } from "react-hook-form"

import type { Expense } from "@/entities/expense"

import { ExpenseIcon, type ExpenseIconOption } from "../lib/icons"

type IconPickerProps = {
  register: UseFormRegister<Expense>
  iconName?: string | null
  iconColor?: string
  iconOptions: ExpenseIconOption[]
  isOpen: boolean
  onToggle: () => void
  onSelect: (value: string) => void
  onClose: () => void
}

export const IconPicker = ({
  register,
  iconName,
  iconColor,
  iconOptions,
  isOpen,
  onToggle,
  onSelect,
  onClose,
}: IconPickerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const colorField = register("icon_color")

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen) return
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-wrap items-start justify-between gap-6 rounded-2xl border border-slate-200/80 bg-slate-50/60 px-4 py-4"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium text-slate-700">Иконка</span>
        <button
          type="button"
          onClick={onToggle}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-300 bg-white shadow-sm transition hover:border-secondary hover:bg-secondary/5"
        >
          <ExpenseIcon name={iconName ?? undefined} color={iconColor} size={32} strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium text-slate-700">Цвет</span>
        <input
          {...colorField}
          type="color"
          className="h-16 w-16 cursor-pointer appearance-none rounded-full border border-transparent bg-transparent p-0 transition hover:border-secondary focus-visible:outline-none"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.18 }}
            className="absolute left-1/2 top-full z-20 mt-4 w-[22rem] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
          >
            <div className="grid grid-cols-4 gap-3">
              {iconOptions.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onSelect(value)}
                  className="flex flex-col items-center gap-1 rounded-xl p-2 text-xs text-slate-500 transition hover:bg-secondary/10 hover:text-secondary"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                    <ExpenseIcon name={value} color={iconColor} size={26} strokeWidth={1.6} />
                  </div>
                  <span className="text-[11px] text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
