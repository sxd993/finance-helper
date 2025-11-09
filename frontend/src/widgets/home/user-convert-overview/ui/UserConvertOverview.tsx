import { UserConvertCard } from "./UserConvertCard"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { EmptyConverts } from "@/shared/ui/states"
import { Info } from "lucide-react"
import { useUserConvertsLimits } from "@/features/converts/get-user-converts-limits/model/useUserConvertsLimits"
import { usePrefetchConvertsData } from "@/features/converts/get-user-converts-limits/model/usePrefetchConvertsData"

export const UserConvertOverview = () => {
  usePrefetchConvertsData()
  const { userConvertsLimits } = useUserConvertsLimits();
  const filteredConverts =
    userConvertsLimits?.filter(
      (convert) => convert.typeCode !== 'saving' && convert.typeCode !== 'investment'
    ) ?? [];
  const isEmpty = filteredConverts.length === 0

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5">
        <SectionTitle
          title="Ваши конверты"
          icon={<Info className="w-6 h-6 text-primary" />}
        />

        {isEmpty ? (
          <EmptyConverts />
        ) : (
          <>
            {filteredConverts.map((convert) => (
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
