import { useSelector } from "react-redux"
import type { RootState } from "@/app/providers"
import { useUserConverts } from "@/features/converts/get-user-converts/models/useUserConverts"
import { List } from "lucide-react"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { ConvertCard } from "./ConvertCard"
import { EmptyConverts } from "@/entities/convert"

export const ConvertList = () => {
    const convert_type = useSelector((state: RootState) => state.convert_tabs.activeTab)
    const { converts } = useUserConverts();
    const filteredConverts = converts?.filter(c => c.type_code === convert_type)
    const hasConverts = converts?.length === 0

    return (
        <>
            <SectionTitle
                icon={<List w-4 h-4 />}
                title="Список конвертов"
            />
            {hasConverts && (
                <EmptyConverts />
            )}

            {filteredConverts?.map((convert) => (
                <div key={convert.id}>
                    <ConvertCard convert={convert} />
                </div>
            ))}
        </>
    )
}