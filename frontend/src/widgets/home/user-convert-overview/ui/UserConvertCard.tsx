import type { ConvertGroup } from "@/entities/convert"
import { ImportantCardOverview } from "./cards/ImportantCardOverview";
import { WishesCardOverview } from "./cards/WishesCardOverview";
import { SavingCardOverview } from "./cards/SavingCardOverview";
import { InvestmentCardOverview } from "./cards/investmentCardOverview";

interface Props {
    convert: ConvertGroup;
}

export const UserConvertCard = ({ convert }: Props) => {
    switch (convert.code) {
        case 'important':
            return (
                <ImportantCardOverview convert={convert} />
            )
        case 'wishes':
            return (
                <WishesCardOverview convert={convert} />
            )
        case 'saving':
            return (
                <SavingCardOverview convert={convert} />
            )
        case 'investment':
            return (
                <InvestmentCardOverview convert={convert} />
            )
    }
}