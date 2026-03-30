import type { Expense } from "@/entities/expense";
import { Modal } from "@/shared/ui/Modal";

import { EditExpenseForm } from "./EditExpenseForm";

interface EditExpenseModalProps {
  expense: Expense;
  isOpen: boolean;
  onClose: () => void;
}

export const EditExpenseModal = ({ expense, isOpen, onClose }: EditExpenseModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Редактировать расход"
      widthClassName="max-w-2xl"
    >
      <EditExpenseForm expense={expense} onClose={onClose} />
    </Modal>
  );
};
