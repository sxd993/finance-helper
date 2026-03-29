
//UI
import { useCreateConvertForm } from "../model/hooks/useCreateConvertForm"
import { SavingFields } from "./fields/SavingFields"
import { ImportantFields } from "./fields/ImportantFields"
import { WishesFields } from "./fields/WishesFields"
import { InvestmentFields } from "./fields/InvestmentFields"
import { ConvertLimitCard } from "@/features/converts/get-user-converts-limits/ui/ConvertLimitCard"
import { ChevronDown } from "lucide-react"

//Hooks
import { useConvertTypes } from "../../get-convert-types/model/useConvertTypes"



export const AddConvertsForm = () => {
  const { register, watch, onSubmit, isPending, errorMessage, formState } = useCreateConvertForm()
  const { errors } = formState
  const { convert_types } = useConvertTypes()
  const type = watch("type_code")
  const canSubmit = Boolean(watch("name")) && Boolean(type)


  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-6 rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-8"
    >
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-medium text-slate-700">Тип конверта</label>
        <div className="relative">
          <select
            {...register("type_code", { required: true })}
            className="w-full appearance-none rounded-xl border border-slate-300 px-4 py-2.5 pr-10 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary"
          >
            <option value="">Выберите тип...</option>
            {convert_types?.map((convert) => (
              <option key={convert.code} value={convert.code}>
                {convert.title}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3 text-slate-400" />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-medium text-slate-700">Название конверта</label>
        <input
          {...register("name", { required: true })}
          type="text"
          placeholder="Название конверта"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary"
        />
      </div>


      {type && <ConvertLimitCard typeCode={type} />}
      {type === "important" && (
        <ImportantFields
          register={register}
          error={errors}
        />
      )}
      {type === "saving" && (
        <SavingFields
          register={register}
          error={errors}
        />
      )}
      {type === "wishes" && (
        <WishesFields register={register}
          error={errors}
        />
      )}
      {type === "investment" && (
        <InvestmentFields
          register={register}
          error={errors}
        />
      )}

      <button
        type="submit"
        disabled={isPending || !canSubmit}
        className="mt-2 w-full rounded-2xl bg-secondary py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-secondary-dark disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-white"
      >
        {isPending ? "Создание..." : "Создать конверт"}
      </button>

      {errorMessage && <p className="w-full text-center text-sm text-red-500">{errorMessage}</p>}
    </form>
  )
}
