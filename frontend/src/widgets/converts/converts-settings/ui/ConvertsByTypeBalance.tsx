import { formatPrice } from "@/shared/utils/formatPrice";
import { useConvertByTypes } from "../model/useConvertByTypes";

export const ConvertsByTypeBalance = () => {
    const { convert_overview_group } = useConvertByTypes();
    console.log(convert_overview_group)

    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-muted-foreground mb-1">Всего средств</p>
                <p className="text-2xl">{formatPrice(convert_overview_group?.currentSum)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-muted-foreground mb-1">Общий лимит</p>
                <p className="text-2xl">{convert_overview_group?.current_convert_limit}</p>
            </div>
        </div>
    );
}
