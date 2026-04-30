import type { RootState } from "@/app/providers"
import { useUserConvertsLimits } from "@/features/converts/get-user-converts-limits/model/useUserConvertsLimits"
import { useSelector } from "react-redux"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { Mail } from "lucide-react"
import { ConvertOverviewCard } from "./ConvertOverviewCard"

export const ConvertOverview = () => {
    const typeCode = useSelector((state: RootState) => state.convert_tabs.activeTab)
    const { userConvertsLimits } = useUserConvertsLimits();
    const filteredConvert = userConvertsLimits?.filter(c => c.typeCode === typeCode) ?? null;
    const hasOverviewContent = filteredConvert?.some((convert) => {
        const isSpendType = convert.typeCode === "important" || convert.typeCode === "wishes";
        const available = isSpendType
            ? Number(convert.availableToSpend ?? 0)
            : Number(convert.availableToAllocate ?? 0);

        return available > 0;
    }) ?? false;


    return (
        <>
            {hasOverviewContent && (
                <SectionTitle
                    icon={<Mail className="h-6 w-6 text-primary"/>}
                    title="Общая информация"
                />
            )}

            {filteredConvert?.map(c => (
                <ConvertOverviewCard
                    key={c.typeCode}
                    convert={c}
                    isHasRemainder={(() => {
                        const isSpendType = c.typeCode === "important" || c.typeCode === "wishes";
                        const available = isSpendType
                            ? Number(c.availableToSpend ?? 0)
                            : Number(c.availableToAllocate ?? 0);

                        return available === 0;
                    })()}
                />
            ))}
        </>

    )
}
