import type { UserConvertLimit } from "@/features/converts/get-user-converts-limits/model/types"
import { formatTypeCode } from "@/features/converts/add-convert/model/lib/formatTypeCode"
import { formatPrice } from "@/shared/utils/formatPrice"

interface Props {
    convert: UserConvertLimit
}

export const useConvertCardOverviewMetrics = ({ convert }: Props) => {
    const typeCode = convert.typeCode
    const title = formatTypeCode(convert.typeCode)
    const distributedAmount = formatPrice(convert.distributedAmount)
    const limitAmount = formatPrice(convert.limitAmount)
    const percentage = (convert.distributedAmount / convert.limitAmount) * 100;

    // Инвестиции
    const absoluteReturn = (convert.limitAmount / convert.distributedAmount) * 100

    const color = absoluteReturn >= 0 ? 'text-green-600' : 'text-red-600';

    return {
        title,
        typeCode,
        distributedAmount,
        limitAmount,
        percentage,

        // Инвестиции
        absoluteReturn,
        color

    }
}