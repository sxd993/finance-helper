import { formatPrice } from "@/shared/utils/formatPrice";
import { useEditConvert } from "../model/useEditConvert";

export const EditConvertBalance = () => {
    const { convert_overview_group, isLoading } = useEditConvert();


    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 h-16 animate-pulse" />
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 h-16 animate-pulse" />
            </div>
        );
    }


    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-muted-foreground mb-1">Всего средств</p>
                <p className="text-2xl">{formatPrice(convert_overview_group?.currentSum)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-muted-foreground mb-1">Общий лимит</p>
                <p className="text-2xl">{convert_overview_group?.totalSum == null ? '—' : formatPrice(convert_overview_group?.totalSum)}</p>
            </div>
        </div>
    );
}
