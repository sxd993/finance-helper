import { BalanceCard } from "@/shared/ui/BalanceCard"

export const Dashboard = () => {
    return (
        <div className="flex flex-col gap-6 pt-5">
            <BalanceCard
                title='Общий баланс'
                sum={120000}
                subtitle="Ваши финансы в полном порядке!"
            />
            
        </div>
    )
}