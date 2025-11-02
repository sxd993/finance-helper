import type { ConvertGroup } from "@/entities/convert";
import { formatPrice } from "@/shared/utils/formatPrice";
import { getCardVariant } from "../../model/convertCardVariants";
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon";

interface Props {
    convert: ConvertGroup;
}


export const InvestmentCardOverview = ({ convert }: Props) => {
    const styles = getCardVariant("investment");
    const Icon = styles.Icon;

    return (
        <div className="group">
            <div className="rounded-2xl border border-slate-200 bg-white transition-shadow duration-300 group-hover:shadow-md">
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}
                            >
                                {renderConvertIcon(convert.code)}
                            </div>
                            <span className="text-gray-900 text-lg">
                                {convert.info.title}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
