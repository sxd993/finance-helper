import type { ConvertGroup } from "@/entities/convert"
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon";
import { formatPrice } from "@/shared/utils/formatPrice";

interface Props {
    convert: ConvertGroup;
}


export const SavingCardOverview = ({ convert }: Props) => {
    return (
        <div className="shadow-sm rounded-2xl border-1 border-slate-200">
            <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        {renderConvertIcon(convert.code)}
                        <h3>{convert.info.title}</h3>
                    </div>
                    <div className="flex flex-col justify-end items-end text-end">

                        <p className="font-medium">Остаток: {formatPrice(convert.currentSum)}</p>
                    </div>
                </div>
                <div className="space-y-2">
                </div>
            </div>
        </div>
    )
}