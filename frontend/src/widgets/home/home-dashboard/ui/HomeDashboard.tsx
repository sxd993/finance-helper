import { BalanceCard } from "@/shared/ui/BalanceCard"
import { Button } from "@/shared/ui/Button"
import { TransactionModal } from "@widgets/transaction/transaction-modal"
import { useTransactionModal } from "@widgets/transaction/transaction-modal"

export const HomeDashboard = () => {
    const { openModal } = useTransactionModal()
    return (
        <div className="flex flex-col gap-2">
            <BalanceCard
                title='Общий баланс'
                sum={120000}
                subtitle="Ваши финансы в полном порядке!"
            />
            <div className="flex justify-center">
                <Button title="+ Пополнить" onClick={() => openModal('income')} />
            </div>
            <TransactionModal />
        </div>
    )
}