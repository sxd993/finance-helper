import { actions } from "../lib"
import { QuickActionCard } from "./QuickActionCard"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { Zap } from "lucide-react"

export const QuickActionGrids = () => {
    return (
        <div className="flex flex-col items-start gap-5 max-w-3xl">
            <SectionTitle
                title="Быстрые действия"
                icon={<Zap className="w-6 h-6 text-primary" />}
            />
            <div className="grid grid-cols-3 justify-items-center gap-4 w-full">
                {actions.map(action => (
                    <QuickActionCard key={action.title} action={action} />
                ))}
            </div>

        </div>

    )
}