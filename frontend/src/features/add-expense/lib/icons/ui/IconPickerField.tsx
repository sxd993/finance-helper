import { Modal } from "@/shared/ui/Modal"
import { ExpenseIcon } from "../components/ExpenseIcon"
import { useIconPicker } from "../model/useIconPicker"
import { useModal } from "@/shared/ui/Modal/model/useModal"
import { EXPENSE_ICON_OPTIONS, EXPENSE_ICON_REGISTRY } from "../const/registry"

export const IconPickerField = () => {
  const { isOpen, open, close } = useModal("add-expense-icon-picker")
  const { iconName, iconColor, selectedIcon, handleIconSelect, handleColorChange } = useIconPicker()

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-slate-700">Иконка и цвет</span>

      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left shadow-sm transition hover:border-secondary hover:bg-secondary/5"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
            <ExpenseIcon name={iconName} color={iconColor} size={28} strokeWidth={1.6} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800">
              {selectedIcon?.label ?? "Не выбрано"}
            </span>
          </div>
        </div>

        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-inner">
          <span
            className="inline-flex h-5 w-5 rounded-full border border-slate-200/70"
            style={{ backgroundColor: iconColor }}
          />
        </span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Выбор иконки"
        widthClassName="max-w-2xl"
        className="pb-2"
      >
        <div className="flex flex-col gap-6 pt-4">
          {/* выбор цвета */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">Цвет иконки</span>
              <input
                type="color"
                value={iconColor}
                onChange={handleColorChange}
                className="h-10 w-10 cursor-pointer appearance-none rounded-full border border-slate-200 bg-white p-0 shadow-sm transition hover:border-secondary"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase text-slate-400">Текущий цвет</span>
              <span className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600">
                {iconColor}
              </span>
            </div>
          </div>

          {/* сетка иконок */}
          <div className="grid grid-cols-4 gap-2">
            {EXPENSE_ICON_OPTIONS.map(({ value, label }) => {
              const isActive = value === selectedIcon?.value
              const IconComponent = EXPENSE_ICON_REGISTRY[value]
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleIconSelect(value)}
                  aria-pressed={isActive}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-xs transition ${isActive
                      ? "border-secondary bg-secondary/10 text-secondary"
                      : "border-transparent bg-white text-slate-500 hover:border-secondary/40 hover:bg-secondary/5 hover:text-secondary"
                    }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                    <IconComponent color={iconColor} size={26} strokeWidth={1.6} />
                  </div>
                  <span className="text-[11px] text-center leading-tight">{label}</span>
                </button>
              )
            })}
          </div>

          {/* кнопка готово */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={close}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-secondary hover:text-secondary"
            >
              Готово
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
