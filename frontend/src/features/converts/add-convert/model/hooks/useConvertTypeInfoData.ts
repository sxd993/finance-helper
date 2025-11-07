import { useMemo } from 'react'

import { formatPrice } from '@/shared/utils/formatPrice'
import type { UseUserConvertsLimitsResult } from '@/features/converts/get-user-converts-limits/model/types'
import { useConvertTypes } from '@/features/converts/get-convert-types'

type ConvertLimits = UseUserConvertsLimitsResult['userConvertsLimits']

const ORDER_MAP: Record<string, number> = {
  important: 0,
  wishes: 1,
  saving: 2,
  investment: 3,
}

export const useConvertTypeInfoData = (data?: ConvertLimits) => {
  const { convert_types } = useConvertTypes()

  const cards = useMemo(() => {
    if (!data?.length) return []

    const sorted = [...data].sort((a, b) => {
      const orderA = ORDER_MAP[a.typeCode] ?? Number.MAX_SAFE_INTEGER
      const orderB = ORDER_MAP[b.typeCode] ?? Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })

    return sorted.map((item) => {
      const { typeCode, limitAmount = 0, distributedAmount = 0, remainderAmount = 0 } = item
      const typeInfo = convert_types.find((convertType) => convertType.code === typeCode)

      const defaultTitleMap: Record<string, string> = {
        important: 'Важные расходы',
        wishes: 'Желания',
        saving: 'Сбережения',
        investment: 'Инвестиции',
      }

      return {
        key: typeCode,
        title: typeInfo?.title ?? defaultTitleMap[typeCode] ?? `Тип: ${typeCode}`,
        description: typeInfo?.description ?? null,
        items: [
          { label: 'Лимит', value: formatPrice(limitAmount) },
          { label: 'Распределено', value: formatPrice(distributedAmount) },
          { label: 'Остаток', value: formatPrice(remainderAmount) },
        ],
      }
    })
  }, [data, convert_types])

  return {
    cards,
    hasData: cards.length > 0,
  }
}
