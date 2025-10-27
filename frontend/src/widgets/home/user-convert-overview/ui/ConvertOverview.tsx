import { ConvertCard } from "./ConvertCard"
import { useConvertOverview } from "@/entities/convert"
import { ConvertOverviewEmpty } from "./ConvertOverviewEmpty"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { Info } from "lucide-react"

export const ConvertOverview = () => {
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
            <ConvertCard
              key={convert.code}
              type={convert.info?.title ?? convert.code}
              currentSum={convert.currentSum}
              code={convert.code}
            />
          ))
        )}
      </div>
    </div>
  )
}
