import type { Convert } from "@/entities/convert"

import { ImportantConvertCard } from "./cards/ImportantConvertCard"
import { WishesConvertCard } from "./cards/WishesConvertCard"
import { SavingConvertCard } from "./cards/SavingConvertCard"
import { InvestmentConvertCard } from "./cards/InvestmentConvertCard"

interface Props {
    convert: Convert
}

export const ConvertCard = ({ convert }: Props) => {
    switch (convert.type_code) {
        case "important":
            return <ImportantConvertCard convert={convert} />
        case "wishes":
            return <WishesConvertCard convert={convert} />
        case "investment":
            return <InvestmentConvertCard convert={convert} />
        case "saving":
        default:
            return <SavingConvertCard convert={convert} />
    }
}
