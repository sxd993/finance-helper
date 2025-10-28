import type { ConvertTypeLimitSummary } from "@/entities/convert/model/types"
import { formatPrice } from "@/shared/utils/formatPrice"

interface Props {
  convertType?: ConvertTypeLimitSummary
}

const formatNumber = (value: number | null) => {
  if (value == null) {
    return null
  }

  return formatPrice(value) ?? value.toLocaleString("ru-RU")
}

export const ConvertTypeInfo = ({ convertType }: Props) => {
  if (!convertType) {
    return null
  }

  const { title, description, limit, used, available, percent, has_limit } = convertType

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
    percent != null
      ? { label: "Процент от дохода", value: `${percent}%` }
      : null,
  ].filter(Boolean) as { label: string; value: string | number }[]

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}

      {infoItems.length > 0 && (
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
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
