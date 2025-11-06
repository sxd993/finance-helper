import type { ConvertGroup, ConvertTypeLimitSummary } from "@/entities/convert/model/types"
import { formatPrice } from "@/shared/utils/formatPrice"

interface Props {
  convertType?: ConvertTypeLimitSummary
  overview?: ConvertGroup
  fallbackTitle?: string
  fallbackDescription?: string
}

const formatNumber = (value: number | null | undefined) => {
  if (value == null) {
    return null
  }

  return formatPrice(value) ?? value.toLocaleString("ru-RU")
}

export const ConvertTypeInfo = ({
  convertType,
  overview,
  fallbackTitle = "Информация о типе",
  fallbackDescription = "Выберите тип конверта, чтобы увидеть доступные лимиты и рекомендации.",
}: Props) => {
  if (!convertType && !overview) {
    return (
      <div className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-left shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{fallbackTitle}</h2>
        {fallbackDescription && <p className="mt-1 text-sm text-slate-600">{fallbackDescription}</p>}
      </div>
    )
  }

  const overviewInfo = overview?.info

  const code = convertType?.code ?? overview?.code ?? ""
  const title = convertType?.title ?? overviewInfo?.title ?? fallbackTitle
  const description = convertType?.description ?? null
  const has_limit = convertType?.has_limit ?? null

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
      {
        label: "Вложено",
        value: formatNumber(convertType?.initial_total ?? overviewInfo?.total_limit) ?? "—",
      },
      {
        label: "Текущая стоимость",
        value: formatNumber(convertType?.current_total ?? overview?.currentSum) ?? "—",
      },
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

  const usedValue =
    convertType?.used ??
    overviewInfo?.used_limit ??
    null

  const availableValue =
    convertType?.available ??
    overviewInfo?.avaliable_limit ??
    null

  const infoItems = [
    availableValue != null
      ? { label: "Доступно", value: formatNumber(availableValue) }
      : has_limit
        ? { label: "Доступно", value: "—" }
        : null,
    usedValue != null
      ? {
        label: "Распределено",
        value: formatNumber(usedValue) ?? "0",
      }
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
