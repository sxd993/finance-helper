import type { RootState } from "@/app/providers"
import { useUserConvertsLimits } from "@/features/converts/get-user-converts-limits/model/useUserConvertsLimits"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { Mail } from "lucide-react"
import { useSelector } from "react-redux"
import { ConvertOverviewCard } from "./ConvertOverviewCard"

export const ConvertOverview = () => {
    const typeCode = useSelector((state: RootState) => state.convert_tabs.activeTab)
    const { userConvertsLimits } = useUserConvertsLimits();
    const filteredConvert = userConvertsLimits?.filter(c => c.typeCode === typeCode) ?? null;


    return (
        <>
            <SectionTitle
                icon={<Mail h-4 w-4 />}
                title="Общая информация"
            />

            {filteredConvert?.map(c => (
                <ConvertOverviewCard
                    key={c.typeCode}
                    convert={c}
                    isHasRemainder={c.remainderAmount === 0}
                />
            ))}
        </>

    )
}
