import { UserConvertCard } from "./UserConvertCard"
import { useConvertOverview } from "@/entities/convert"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { EmptyConverts } from "@/shared/ui/states"
import { Info } from "lucide-react"
import { buildOverviewSummary } from "../lib/buildOverviewSummary"
import { OverviewSummaryCard } from "./OverviewSummaryCard"
// Distribution widget moved off Home per feedback

export const UserConvertOverview = () => {
  const { convertOverview, isLoading } = useConvertOverview()
  const isEmpty = !convertOverview || convertOverview.length === 0
  const summary = !isEmpty && !isLoading && convertOverview
    ? buildOverviewSummary(convertOverview)
    : null

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
          <div className="flex flex-col gap-5">
            {summary && (
              <OverviewSummaryCard summary={summary} />
            )}

            {convertOverview.map((convert) => (
              <UserConvertCard
                key={convert.code}
                convert={convert}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
