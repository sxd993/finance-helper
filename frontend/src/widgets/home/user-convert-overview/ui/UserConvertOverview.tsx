import { UserConvertCard } from "./UserConvertCard"
import { useConvertOverview } from "@/entities/convert"
import { ConvertOverviewEmpty } from "./UserConvertOverviewEmpty"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { Info } from "lucide-react"

export const UserConvertOverview = () => {
  const { convertOverview, isLoading } = useConvertOverview()

  if (isLoading) return <p>Загрузка...</p>

  const isEmpty = !convertOverview || convertOverview.length === 0

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5">
        <SectionTitle
          title="Общая сводка о конвертах"
          icon={<Info className="w-6 h-6 text-primary" />}
        />
        {isEmpty ? (
          <ConvertOverviewEmpty />
        ) : (
          convertOverview.map((convert) => (
            <UserConvertCard
              key={convert.code}
              convert={convert}
            />
          ))
        )}
      </div>
    </div>
  )
}
