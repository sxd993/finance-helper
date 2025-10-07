import { Modal } from "@/shared/ui/Modal"
import { useTransactionModal } from "../model/useTransactionModal"
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