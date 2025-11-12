
//UI
import { useCreateConvertForm } from "../model/hooks/useCreateConvertForm"
import { SavingFields } from "./fields/SavingFields"
import { ImportantFields } from "./fields/ImportantFields"
import { WishesFields } from "./fields/WishesFields"
import { InvestmentFields } from "./fields/InvestmentFields"
import { ConvertLimitCard } from "@/features/converts/get-user-converts-limits/ui/ConvertLimitCard"

//Hooks
import { useConvertTypes } from "../../get-convert-types/model/useConvertTypes"



export const AddConvertsForm = () => {
  const { register, watch, onSubmit, isPending, errorMessage } = useCreateConvertForm()
  const { convert_types } = useConvertTypes()
  const type = watch("type_code")
  const canSubmit = Boolean(watch("name")) && Boolean(type)


  return (
    <form
      onSubmit={onSubmit}
      className="bg-white px-6 py-8 flex flex-col items-center gap-4 rounded-lg w-full border border-slate-200 shadow-lg"
    >
      <div className="flex flex-col gap-2 w-full">
        <h2>Тип конверта</h2>
        <select
          {...register("type_code", { required: true })}
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
        >
          <option value="">Выберите тип...</option>
          {convert_types?.map((convert) => (
            <option key={convert.code} value={convert.code}>
              {convert.title}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex flex-col gap-2 w-full">
        <h2>Название конверта</h2>
        <input
          {...register("name", { required: true })}
          type="text"
          placeholder="Название конверта"
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
        />
      </div>


      {type && <ConvertLimitCard typeCode={type} />}
      {type === "important" && <ImportantFields register={register} />}
      {type === "saving" && <SavingFields register={register} />}
      {type === "wishes" && <WishesFields register={register} />}
      {type === "investment" && <InvestmentFields register={register} />}

      <button
        type="submit"
        disabled={isPending || !canSubmit}
        className="mt-4 px-6 py-2 rounded-xl transition-all
                   bg-secondary text-white hover:bg-secondary/90
                   disabled:bg-slate-300 disabled:text-white disabled:cursor-not-allowed disabled:hover:bg-slate-300"
      >
        {isPending ? "Создание..." : "Создать конверт"}
      </button>

      {errorMessage && <p className="text-red-500 text-center w-full">{errorMessage}</p>}
    </form>
  )
}
