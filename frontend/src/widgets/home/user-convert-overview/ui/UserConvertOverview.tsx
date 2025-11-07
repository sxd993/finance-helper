import { UserConvertCard } from "./UserConvertCard"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { EmptyConverts } from "@/shared/ui/states"
import { Info } from "lucide-react"
import { useUserConvertsLimits } from "@/features/converts/get-user-converts-limits/model/useUserConvertsLimits"

export const UserConvertOverview = () => {
  const { userConvertsLimits } = useUserConvertsLimits();
  const isEmpty = !userConvertsLimits || userConvertsLimits.length === 0

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5">
        <SectionTitle
          title="Общая информация"
          icon={<Info className="w-6 h-6 text-primary" />}
        />

        {isEmpty ? (
          <EmptyConverts />
        ) : (
          <>
            {userConvertsLimits.map((convert) => (
              <UserConvertCard
                key={`${convert.typeCode}-${convert.updatedAt}`}
                convert={convert}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
