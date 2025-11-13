import { useSelector } from "react-redux"
import type { RootState } from "@/app/providers"
import { useUserConverts } from "@/features/converts/get-user-converts/models/useUserConverts"
import { List } from "lucide-react"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { ConvertCard } from "@/entities/convert/ui/ConvertCard"
import { EmptyConverts } from "@/entities/convert"

export const ConvertList = () => {
    const convert_type = useSelector((state: RootState) => state.convert_tabs.activeTab)
    const { converts, isLoading } = useUserConverts()

    const filteredConverts = converts?.filter((c) => c.type_code === convert_type) ?? []
    const isEmpty = !isLoading && filteredConverts.length === 0

    return (
        <>
            <SectionTitle icon={<List w-4 h-4 />} title="Список конвертов" />

            {isLoading && (
                <div className="text-sm text-slate-500 animate-pulse">Загрузка...</div>
            )}

            {isEmpty ? (
                <EmptyConverts />
            ) : (
                filteredConverts.map((convert) => (
                    <ConvertCard key={convert.id} convert={convert} />
                ))
            )}
        </>
    )
}
