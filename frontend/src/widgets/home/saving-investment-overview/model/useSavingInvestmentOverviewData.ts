import { useMemo } from "react"
import { useUserConverts } from "@/features/converts/get-user-converts/models/useUserConverts"
import { useUserConvertsLimits } from "@/features/converts/get-user-converts-limits/model/useUserConvertsLimits"
import { formatPrice } from "@/shared/utils/formatPrice"

const SAVING_TYPE = "saving"
const INVESTMENT_TYPE = "investment"

export const useSavingInvestmentOverviewData = () => {
  const { converts, isLoading: isConvertsLoading } = useUserConverts()
  const { userConvertsLimits, isLoading: isLimitsLoading } = useUserConvertsLimits()

  const savingConverts = useMemo(
    () => (converts ?? []).filter((convert) => convert.type_code === SAVING_TYPE),
    [converts]
  )

  const investmentConverts = useMemo(
    () => (converts ?? []).filter((convert) => convert.type_code === INVESTMENT_TYPE),
    [converts]
  )

  const limitsByType = useMemo(() => {
    const map = new Map<string, number>()
    userConvertsLimits?.forEach((limit) => {
      map.set(limit.typeCode, limit.remainderAmount ?? 0)
    })
    return map
  }, [userConvertsLimits])

  const savingTopUpAmount = limitsByType.get(SAVING_TYPE) ?? 0
  const investmentTopUpAmount = limitsByType.get(INVESTMENT_TYPE) ?? 0

  const hasSaving = savingConverts.length > 0
  const hasInvestment = investmentConverts.length > 0
  const isLoading = isConvertsLoading || isLimitsLoading
  const isEmpty = !isLoading && !hasSaving && !hasInvestment

  return {
    savingConverts,
    investmentConverts,
    savingTopUpAmount,
    investmentTopUpAmount,
    savingTopUpLabel: formatPrice(savingTopUpAmount),
    investmentTopUpLabel: formatPrice(investmentTopUpAmount),
    hasSaving,
    hasInvestment,
    hasAnyConverts: hasSaving || hasInvestment,
    isLoading,
    isEmpty,
  }
}
