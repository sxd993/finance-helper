import type { UserConvertLimit } from "@/features/converts/get-user-converts-limits/model/types"
import { formatTypeCode } from "@/entities/convert"
import { formatPrice } from "@/shared/utils/formatPrice"

interface Props {
    convert: UserConvertLimit
}

export const useConvertCardMetrics = ({ convert }: Props) => {
    const typeCode = convert.typeCode
    const title = formatTypeCode(convert.typeCode)
    const allocatedAmount = formatPrice(convert.allocatedAmount)
    const limitAmount = formatPrice(convert.limitAmount)
    const safeLimit = Number(convert.limitAmount) || 0
    const availableToSpend = Number(convert.availableToSpend ?? 0)
    const percentage = safeLimit > 0
        ? Math.floor((availableToSpend / safeLimit) * 100)
        : 0
    const remainderAmount = formatPrice(availableToSpend)

    const progressColor = (typeCode : string) => {
        switch (typeCode) {
            case 'important':
                return 'bg-orange-500'
            case 'wishes':
                return 'bg-yellow-500'
            case 'saving':
                return 'bg-green-500'
            case 'investment':
                return 'bg-blue-500'
        }
    }

    // Инвестиции
    const absoluteReturn = convert.allocatedAmount ? (convert.limitAmount / convert.allocatedAmount) * 100 : 0
    const color = absoluteReturn >= 0 ? 'text-green-600' : 'text-red-600';

    return {
        title,
        typeCode,
        allocatedAmount,
        limitAmount,
        percentage,
        remainderAmount,
        progressColor,

        // Инвестиции
        absoluteReturn,
        color

    }
}
