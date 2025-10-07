import { BalanceCard } from "@/shared/ui/BalanceCard"
import { Button } from "@/shared/ui/Button"
import { TransactionModal } from "@widgets/transaction-modal"
import { useTransactionModal } from "@widgets/transaction-modal/model/useTransactionModal"

export const Dashboard = () => {
    const { openModal } = useTransactionModal()
    return (
        <div className="flex flex-col gap-2 pt-5 mx-auto max-w-3xl">
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