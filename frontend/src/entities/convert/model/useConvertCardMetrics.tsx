import type { UserConvertLimit } from "@/features/converts/get-user-converts-limits/model/types"
import { formatTypeCode } from "@/features/converts/add-convert/model/lib/formatTypeCode"
import { formatPrice } from "@/shared/utils/formatPrice"

interface Props {
    convert: UserConvertLimit
}

export const useConvertCardMetrics = ({ convert }: Props) => {
    const typeCode = convert.typeCode
    const title = formatTypeCode(convert.typeCode)
    const distributedAmount = formatPrice(convert.distributedAmount)
    const limitAmount = formatPrice(convert.limitAmount)
    const percentage = Math.floor((convert.remainderAmount / convert.limitAmount) * 100);
    const remainderAmount = formatPrice(convert.remainderAmount)

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
    const absoluteReturn = (convert.limitAmount / convert.distributedAmount) * 100
    const color = absoluteReturn >= 0 ? 'text-green-600' : 'text-red-600';

    return {
        title,
        typeCode,
        distributedAmount,
        limitAmount,
        percentage,
        remainderAmount,
        progressColor,

        // Инвестиции
        absoluteReturn,
        color

    }
}