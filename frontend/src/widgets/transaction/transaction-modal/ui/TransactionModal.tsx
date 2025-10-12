import { Modal } from "@/shared/ui/Modal"
import { useTransactionModal } from "@widgets/transaction/transaction-modal"
import { ModalTabs } from "./ModalTabs"
import { ModalContent } from "./ModalContent"


export const TransactionModal = () => {
    const {
        isOpen,
        closeModal
    } = useTransactionModal()
    return (
        <Modal isOpen={isOpen} onClose={closeModal} title='Новая транзакция'>
            <ModalTabs />
            <ModalContent />
        </Modal>
    )
}