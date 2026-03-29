import { useSelector } from "react-redux"
import type { RootState } from "@/app/providers"
import { useUserConverts } from "@/features/converts/get-user-converts/models/useUserConverts"
import { List, Plus } from "lucide-react"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { Button } from "@/shared/ui/Button"
import { ConvertCard } from "@/entities/convert/ui/ConvertCard"
import { EmptyConverts } from "@/entities/convert"
import { useNavigate } from "react-router-dom"

export const ConvertList = () => {
    const convert_type = useSelector((state: RootState) => state.convert_tabs.activeTab)
    const { converts, isLoading } = useUserConverts()
    const navigate = useNavigate()

    const filteredConverts = converts?.filter((c) => c.type_code === convert_type) ?? []
    const isEmpty = !isLoading && filteredConverts.length === 0

    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <SectionTitle icon={<List className="h-6 w-6 text-primary" />} title="Конверты" />
                <Button
                    onClick={() => { navigate('/converts/add-converts') }}
                    title="Добавить"
                    bg="secondary"
                    size="sm"
                    leftIcon={<Plus width={18} height={18} />}
                    className="shrink-0 gap-2 px-4 py-2.5 shadow-sm"
                />
            </div>

            {isLoading && (
                <div className="text-sm text-slate-500 animate-pulse">Загрузка...</div>
            )}

            {isEmpty ? (
                <EmptyConverts typeCode={convert_type} />
            ) : (
                filteredConverts.map((convert) => (
                    <ConvertCard key={convert.id} convert={convert} />
                ))
            )}
        </>
    )
}
