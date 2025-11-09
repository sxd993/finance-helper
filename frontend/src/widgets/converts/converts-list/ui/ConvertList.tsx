import { useSelector } from "react-redux"
import type { RootState } from "@/app/providers"
import { useUserConverts } from "@/features/converts/get-user-converts/models/useUserConverts"
import { Lock } from "lucide-react"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { ConvertCard } from "./ConvertCard"

export const ConvertList = () => {
    const convert_type = useSelector((state: RootState) => state.convert_tabs.activeTab)
    const { converts } = useUserConverts();
    const filteredConverts = converts?.filter(c => c.type_code === convert_type)

    return (
        <>
            <SectionTitle
                icon={<Lock w-4 h-4 />}
                title="Список конвертов"
            />
            {filteredConverts?.map((convert) => (
                <div key={convert.id}>
                    <ConvertCard convert={convert} />
                </div>
            ))}
        </>
    )
}