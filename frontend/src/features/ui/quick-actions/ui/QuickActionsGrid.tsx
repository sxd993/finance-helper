import { useNavigate } from "react-router-dom"
import { QuickActionCard } from "./QuickActionCard"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { Zap } from "lucide-react"
import { useQuickActions } from "../model/useQuickActions"

export const QuickActionGrids = () => {
    const navigate = useNavigate()
    const actions = useQuickActions(navigate)

    return (
        <div className="flex flex-col items-start gap-5 max-w-3xl mb-5">
            <SectionTitle
                title="Быстрые действия"
                icon={<Zap className="w-6 h-6 text-primary" />}
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 justify-items-center w-full max-w-2xl mx-auto">
                {actions.map(action => (
                    <QuickActionCard key={action.title} action={action} />
                ))}
            </div>

        </div>

    )
}