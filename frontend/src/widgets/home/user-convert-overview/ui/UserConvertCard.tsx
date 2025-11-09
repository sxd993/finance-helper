import { ImportantCardOverview } from "./cards/ImportantCardOverview";
import { WishesCardOverview } from "./cards/WishesCardOverview";
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
    }
}