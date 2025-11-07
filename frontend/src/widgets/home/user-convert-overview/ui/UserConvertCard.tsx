import { ImportantCardOverview } from "./cards/ImportantCardOverview";
import { WishesCardOverview } from "./cards/WishesCardOverview";
import { SavingCardOverview } from "./cards/SavingCardOverview";
import { InvestmentCardOverview } from "./cards/InvestmentCardOverview";
import type { UserConvertLimit } from "@/features/converts/get-user-converts-limits/model/types";

interface Props {
    convert: UserConvertLimit;
}

export const UserConvertCard = ({ convert }: Props) => {
    switch (convert.typeCode) {
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