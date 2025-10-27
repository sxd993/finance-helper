import { formatPrice } from "@/shared/utils/formatPrice";
import { useConvertByTypes } from "../model/useConvertByTypes";

export const ConvertsByTypeBalance = () => {
    const { convert_overview_group } = useConvertByTypes();
    console.log(convert_overview_group)

    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-md text-muted-foreground">Текущая сумма в конвертах</p>
                <p className="text-xl">{formatPrice(convert_overview_group?.currentSum)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-md text-muted-foreground">Лимит категории</p>
                <p className="text-xl">{formatPrice(convert_overview_group?.info.convert_type_limit)}</p>
            </div>
        </div>
    );
}
