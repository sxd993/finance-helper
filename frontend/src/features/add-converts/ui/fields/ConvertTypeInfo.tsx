import type { ConvertTypeLimitSummary } from "@/entities/convert/model/types"
import { formatPrice } from "@/shared/utils/formatPrice"

interface Props {
  convertType?: ConvertTypeLimitSummary
  fallbackTitle?: string
  fallbackDescription?: string
}

const formatNumber = (value: number | null) => {
  if (value == null) {
    return null
  }

  return formatPrice(value) ?? value.toLocaleString("ru-RU")
}

export const ConvertTypeInfo = ({
  convertType,
  fallbackTitle = "Информация о типе",
  fallbackDescription = "Выберите тип конверта, чтобы увидеть доступные лимиты и рекомендации.",
}: Props) => {
  if (!convertType) {
    return (
      <div className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-left shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{fallbackTitle}</h2>
        {fallbackDescription && <p className="mt-1 text-sm text-slate-600">{fallbackDescription}</p>}
      </div>
    )
  }

  const { code, title, description, limit, used, available, has_limit } = convertType

  if (code === "saving") {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      </div>
    )
  }

  if (code === "investment") {
    const infoItems = [
      { label: "Вложено", value: formatNumber(convertType.initial_total) ?? "—" },
      { label: "Текущая стоимость", value: formatNumber(convertType.current_total) ?? "—" },
    ]

    return (
      <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}

        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {infoItems.map(({ label, value }) => (
            <div key={label} className="flex flex-col">
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-medium text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    )
  }

  const infoItems = [
    limit != null
      ? { label: "Лимит по типу", value: formatNumber(limit) }
      : has_limit
        ? { label: "Лимит по типу", value: "Не задан" }
        : null,
    { label: "Уже распределено", value: formatNumber(used) ?? "0" },
    available != null
      ? { label: "Доступно", value: formatNumber(available) }
      : has_limit
        ? { label: "Доступно", value: "—" }
        : null,
  ].filter(Boolean) as { label: string; value: string | number }[]

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}

      {infoItems.length > 0 && (
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {infoItems.map(({ label, value }) => (
            <div key={label} className="flex flex-col">
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-medium text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
