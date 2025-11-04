import { UserConvertCard } from "./UserConvertCard"
import { useConvertOverview, useConvertTypeLimits } from "@/entities/convert"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { EmptyConverts } from "@/shared/ui/states"
import { Info } from "lucide-react"
import { buildOverviewSummary } from "../lib/buildOverviewSummary"
import { OverviewSummaryCard } from "./OverviewSummaryCard"
import { buildConvertTypeOverview } from "../lib/buildConvertTypeOverview"
import { ConvertTypeOverview } from "./ConvertTypeOverview"
// Distribution widget moved off Home per feedback

export const UserConvertOverview = () => {
  const { convertOverview, isLoading } = useConvertOverview()
  const { convertTypeLimits } = useConvertTypeLimits()
  const isEmpty = !convertOverview || convertOverview.length === 0
  const summary = !isEmpty && !isLoading && convertOverview
    ? buildOverviewSummary(convertOverview)
    : null
  const typeOverviewItems = buildConvertTypeOverview(convertTypeLimits?.limits)
  const hasTypeOverview = typeOverviewItems.length > 0

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5">
        <SectionTitle
          title="Общая информация"
          icon={<Info className="w-6 h-6 text-primary" />}
        />
        {hasTypeOverview && (
          <ConvertTypeOverview items={typeOverviewItems} />
        )}

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
