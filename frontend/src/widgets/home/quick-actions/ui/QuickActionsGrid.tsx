import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { QuickActionCard } from "./QuickActionCard"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { Zap } from "lucide-react"
import { buildQuickActions } from "../lib"
import { buildOverviewSummary } from "@/widgets/home/user-convert-overview/lib/buildOverviewSummary"
import { useConvertOverview } from "@/features/converts/get-converts/model/hooks/useConvertOverview"

export const QuickActionGrids = () => {
    const navigate = useNavigate()
    const { convertOverview } = useConvertOverview()

    const availableBudget = useMemo(() => {
        if (!convertOverview || convertOverview.length === 0) {
            return 0
        }

        const summary = buildOverviewSummary(convertOverview)
        return summary.totalAvailable
    }, [convertOverview])

    const actions = useMemo(
        () => buildQuickActions({ navigate, availableBudget }),
        [navigate, availableBudget],
    )

    return (
        <div className="flex flex-col items-start gap-5 max-w-3xl">
            <SectionTitle
                title="Быстрые действия"
                icon={<Zap className="w-6 h-6 text-primary" />}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:justify-items-center w-full max-w-2xl mx-auto">
                {actions.map(action => (
                    <QuickActionCard key={action.title} action={action} />
                ))}
            </div>

        </div>

    )
}