import { formatTypeCode } from "@/entities/convert"
import type { FilterOption } from "@/features/expenses/expenses-filters/model/types/type"
import type { UserConvertLimit } from "@/features/converts/get-user-converts-limits/model/types"

const BLOCKED_TYPE_CODES = new Set(["saving", "investment"])

export const getConvertTypeOptions = (
  limits: UserConvertLimit[] | null
): FilterOption[] => {
  if (!limits) {
    return []
  }

  return limits
    .filter((limit) => Boolean(limit?.typeCode) && !BLOCKED_TYPE_CODES.has(limit.typeCode))
    .map((limit) => ({
      value: limit.typeCode,
      label: formatTypeCode(limit.typeCode),
    }))
}
