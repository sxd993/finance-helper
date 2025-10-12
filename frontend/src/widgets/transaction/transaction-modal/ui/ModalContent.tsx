import { AddIncomeForm } from "@/features/transaction"
import { AddExpenseForm } from "@/features/transaction"
import { useTransactionModal } from "@widgets/transaction/transaction-modal"

export const ModalContent = () => {
    const { activeTab } = useTransactionModal()

    return (
        <>
            {activeTab === 'income' && <AddIncomeForm />}
            {activeTab === 'expense' && <AddExpenseForm />}
        </>
    )
}
