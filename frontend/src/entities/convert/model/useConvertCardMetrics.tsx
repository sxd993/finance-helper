import type { UserConvertLimit } from "@/features/converts/get-user-converts-limits/model/types"
import { formatTypeCode } from "@/entities/convert"
import { getConvertTypeColor } from "@/entities/convert/lib/getConvertTypeColor"
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
    const isSpendType = typeCode === "important" || typeCode === "wishes"
    const availableAmount = Number(
        isSpendType
            ? (convert.availableToSpend ?? 0)
            : (convert.availableToAllocate ?? 0)
    )
    const percentage = safeLimit > 0
        ? Math.floor((availableAmount / safeLimit) * 100)
        : 0
    const remainderAmount = formatPrice(availableAmount)

    const progressColor = (typeCode : string) => {
        return getConvertTypeColor(typeCode).bg
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
