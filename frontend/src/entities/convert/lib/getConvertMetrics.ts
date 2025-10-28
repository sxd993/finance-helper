import type { Convert } from "@/entities/convert/model/types"

const toNumber = (value: unknown, fallback = 0): number => {
  if (value === null || value === undefined) {
    return fallback
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value))
const toPercentValue = (value: number) => Math.round(clamp(value))

const resolveTypeCode = (convert: Convert) => convert.type?.code ?? convert.type_code

const pickValue = (convert: Convert, ...keys: string[]) => {
  const source = convert as Record<string, unknown>

  for (const key of keys) {
    if (key in source && source[key] != null) {
      return source[key]
    }
  }

  return undefined
}

const resolveCurrentBalance = (convert: Convert, typeCode: string): number => {
  if (typeCode === "investment") {
    const currentValue = pickValue(
      convert,
      "current_value",
      "currentValue",
      "target_amount",
      "targetAmount",
      "current_balance",
      "currentBalance",
      "balance",
    )
    return toNumber(currentValue, toNumber(convert.initial_amount))
  }

  const balanceCandidate = pickValue(
    convert,
    "current_balance",
    "currentBalance",
    "balance",
    "initial_amount",
    "initialAmount",
  )
  return toNumber(balanceCandidate)
}

const resolveLimit = (convert: Convert, typeCode: string): number | null => {
  if (typeCode === "important" || typeCode === "wishes" || typeCode === "saving") {
    return toNullableNumber(pickValue(convert, "target_amount", "targetAmount"))
  }

  return null
}

export interface ConvertInvestmentMetrics {
  currentValue: number
  initialValue: number
  absoluteReturn: number
  returnPercentage: number
  isProfit: boolean
  isLoss: boolean
  isNeutral: boolean
}

export interface ConvertMetrics {
  balance: number
  limit: number | null
  spent: number
  percentage: number
  goalPercentage: number
  remainingToGoal: number
  investment: ConvertInvestmentMetrics
}

export const getConvertMetrics = (convert: Convert): ConvertMetrics => {
  const typeCode = resolveTypeCode(convert)

  const balance = resolveCurrentBalance(convert, typeCode)
  const limit = resolveLimit(convert, typeCode)
  const spent = toNumber(pickValue(convert, "total_out", "totalOut"))

  const percentage = limit && limit > 0 ? toPercentValue((balance / limit) * 100) : 100

  const targetValue = toNumber(pickValue(convert, "target_amount", "targetAmount"))
  const remainingToGoal = typeCode === "saving" ? Math.max(0, targetValue - balance) : 0
  const goalPercentage =
    typeCode === "saving"
      ? targetValue > 0
        ? toPercentValue((balance / targetValue) * 100)
        : 100
      : 0

  const initialValue = toNumber(pickValue(convert, "initial_amount", "initialAmount"))
  const currentValue =
    typeCode === "investment"
      ? balance
      : toNumber(pickValue(convert, "current_balance", "currentBalance") ?? balance)
  const absoluteReturn = currentValue - initialValue
  const returnPercentage = initialValue > 0 ? (absoluteReturn / initialValue) * 100 : 0
  const isProfit = absoluteReturn > 0
  const isLoss = absoluteReturn < 0
  const isNeutral = !isProfit && !isLoss

  return {
    balance,
    limit,
    spent,
    percentage,
    goalPercentage,
    remainingToGoal,
    investment: {
      currentValue,
      initialValue,
      absoluteReturn,
      returnPercentage,
      isProfit,
      isLoss,
      isNeutral,
    },
  }
}
