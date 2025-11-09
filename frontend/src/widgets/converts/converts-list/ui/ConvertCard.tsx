import type { Convert } from "../../../../entities/convert/model/types"
import { ImportantCard } from "./cards/ImportantCard"
import { WishesCard } from "./cards/WishesCard"
import { SavingCard } from "./cards/SavingCard"
import { InvestmentCard } from "./cards/InvestmentCard"

interface Props {
    convert: Convert
}

export const ConvertCard = ({ convert }: Props) => {
    const typeCode = convert.type_code

    switch (typeCode) {
        case 'important':
            return <ImportantCard convert={convert} />
        case 'wishes':
            return <WishesCard convert={convert} />
        case 'investment':
            return <InvestmentCard convert={convert} />
        case 'saving':
        default:
            return <SavingCard convert={convert} />
    }
}
