import type { RootState } from "@/app/providers";
import { useSelector } from "react-redux";
import { useAddConvertForm } from "../model/hooks/useAddConvertForm";
import { useConvertTypes } from "@/entities/convert";

export const ConvertDraftsList = () => {
  const drafts = useSelector((state: RootState) => state.converts_drafts)
  const { onCreate, isPending } = useAddConvertForm()
  const { convert_types } = useConvertTypes();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Черновики конвертов</h2>
      </div>

      <ul className="grid grid-cols-1 gap-3">
        {drafts.map((draft, idx) => (
          <li key={idx} className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{draft.name}</div>
                <div className="text-sm text-slate-600">Тип: </div>
              </div>
              <div className="text-sm text-slate-500 flex gap-4">
                {draft.target_amount != null && (
                  <span>Цель: {draft.target_amount}</span>
                )}
                {draft.overall_limit != null && (
                  <span>Лимит: {draft.overall_limit}</span>
                )}
                {draft.current_amount != null && (
                  <span>Текущие: {draft.current_amount}</span>
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
        {isPending ? 'Создание...' : 'Создать все'}
      </button>
    </div>
  )
}

