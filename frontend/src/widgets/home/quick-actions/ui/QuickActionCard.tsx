import type { QuickAction } from '../model/type'

interface QuickActionCardProps {
    action: QuickAction
}

export const QuickActionCard = ({ action }: QuickActionCardProps) => {
    return (
        <button
            onClick={action.action_func}
            className="
                w-full max-w-[120px] h-[100px]
                flex flex-col items-center justify-center gap-2
                rounded-xl border border-slate-200
                bg-white text-slate-800
                transition-colors duration-200
                hover:bg-slate-50 active:bg-slate-100
            "
        >
            <div className="text-2xl">{action.logo}</div>
            <span className="text-sm font-medium text-center">{action.title}</span>
        </button>
    )
}
