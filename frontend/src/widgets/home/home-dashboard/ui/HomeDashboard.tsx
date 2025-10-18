import { BalanceCard } from "@/shared/ui/BalanceCard"

export const HomeDashboard = () => {
    return (
        <div className="flex flex-col gap-2">
            <BalanceCard
                title='Общий баланс'
                sum={120000}
                subtitle="Ваши финансы в полном порядке!"
            />
            <div className="flex justify-center">
                // TODO сделать карточку быстрых действий
            </div>
        </div>
    )
}