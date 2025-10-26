import { ConvertCard } from "./ConvertCard"
import { useConvertOverview } from "@/entities/convert"
import { ConvertOverviewEmpty } from "./ConvertOverviewEmpty"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { Info } from "lucide-react"

export const ConvertOverview = () => {
  const { convertOverview, isLoading } = useConvertOverview()

  if (isLoading) return <p>Загрузка...</p>

  if (!convertOverview || convertOverview.length === 0) {
    return <ConvertOverviewEmpty />
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5">
        <SectionTitle
          title="Общая информация"
          icon={<Info className="w-6 h-6 text-primary" />}
        />

        {convertOverview.map((convert) => (
          <ConvertCard
            key={convert.code}
            type={convert.info?.title ?? convert.code}
            currentSum={convert.currentSum}
            code={convert.code}
          />
        ))}
      </div>
    </div>
  )
}
