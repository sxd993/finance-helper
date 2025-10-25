import type { RootState } from "@/app/providers";
import { useSelector } from "react-redux";
import { useAddConvertForm } from "../model/hooks/useAddConvertForm";
import { formatTypeCode } from "../model/lib/formatTypeCode";
import { Button } from "@/shared/ui/Button";

export const ConvertDraftsList = () => {
  const drafts = useSelector((state: RootState) => state.create_converts_drafts)
  const { onCreate, onClearDrafts, isPending } = useAddConvertForm()


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl ">Черновики конвертов</h2>
        <Button
          title="Очистить"
          bg="white"
          text="black"
          size="sm"
          onClick={onClearDrafts}
        />
      </div>

      <ul className="grid grid-cols-1 gap-3">
        {drafts.map((draft, idx) => (
          <li key={idx} className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex flex-col justify-center items-start gap-2">
                <div className="font-medium">{draft.name}</div>
                <div className="text-sm text-slate-600">Тип: {formatTypeCode(draft.type_code)}</div>
              </div>
              <div className="flex flex-col justify-center text-sm text-slate-500 gap-2 items-center">
                {draft.target_amount != null && (
                  <span>
                    {(draft.type_code === "important" || draft.type_code === "wishes") ? "Лимит" : "Цель"}: {draft.target_amount}
                  </span>
                )}
                {draft.current_amount != null && (
                  <span>Текущие: {draft.current_amount}</span>
                )}
                {draft.initial_amount != null && (
                  <span>Вложено: {draft.initial_amount}</span>
                )}
                {draft.current_value != null && (
                  <span>Стоимость: {draft.current_value}</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={onCreate}
        disabled={isPending || drafts.length === 0}
        className="px-4 py-2 rounded-xl bg-secondary text-white hover:bg-secondary/90 disabled:bg-slate-300 disabled:text-white"
      >
        {isPending ? 'Создание...' : 'Создать'}
      </button>
    </div>
  )
}
