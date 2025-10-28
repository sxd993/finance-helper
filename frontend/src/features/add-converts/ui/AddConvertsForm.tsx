import { useConvertOverview, useConvertTypeLimits, useConvertTypes } from "@/entities/convert"
import { useAddConvertForm } from "../model/hooks/useAddConvertForm"
import { SavingFields } from "./fields/SavingFields"
import { ImportantFields } from "./fields/ImportantFields"
import { WishesFields } from "./fields/WishesFields"
import { InvestmentFields } from "./fields/InvestmentFields"
import { ConvertTypeInfo } from "./fields/ConvertTypeInfo"

export const AddConvertsForm = () => {
  const { register, watch, onSubmit, isPending, errorMessage } = useAddConvertForm()
  const { convert_types } = useConvertTypes()
  const { convertTypeLimits } = useConvertTypeLimits()
  const { convertOverview } = useConvertOverview()
  const type = watch("type_code")
  const canSubmit = Boolean(watch("name")) && Boolean(type)

  const selectedConvertType = convertTypeLimits?.limits.find((convert) => convert.code === type)
  const selectedTypeMeta = convert_types?.find((convert) => convert.code === type)
  const selectedOverview = convertOverview?.find((convert) => convert.code === type)
  const infoTitle = selectedTypeMeta?.title ?? "Описание конверта"
  const infoDescription =
    selectedTypeMeta?.description ?? "Выберите тип конверта, чтобы увидеть лимиты и детали."

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white px-6 py-8 flex flex-col items-center gap-4 rounded-lg w-full border border-slate-200 shadow-lg"
    >
      <div className="flex flex-col gap-2 w-full">
        <h2>Название конверта</h2>
        <input
          {...register("name", { required: true })}
          type="text"
          placeholder="Название конверта"
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
        />
      </div>

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

      <ConvertTypeInfo
        convertType={selectedConvertType}
        overview={selectedOverview}
        fallbackTitle={infoTitle}
        fallbackDescription={infoDescription}
      />

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
        {isPending ? "Добавление..." : "Добавить в черновик"}
      </button>

      {errorMessage && <p className="text-red-500 text-center w-full">{errorMessage}</p>}
    </form>
  )
}
