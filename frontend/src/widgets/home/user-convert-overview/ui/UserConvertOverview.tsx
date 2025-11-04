import { UserConvertCard } from "./UserConvertCard"
import { useConvertOverview } from "@/entities/convert"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { EmptyConverts } from "@/shared/ui/states"
import { Info } from "lucide-react"

export const UserConvertOverview = () => {
  const { convertOverview, isLoading } = useConvertOverview()
  const isEmpty = !convertOverview || convertOverview.length === 0

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5">
        <SectionTitle
          title="Общая информация"
          icon={<Info className="w-6 h-6 text-primary" />}
        />
        {isEmpty || isLoading ? (
          <EmptyConverts />
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
