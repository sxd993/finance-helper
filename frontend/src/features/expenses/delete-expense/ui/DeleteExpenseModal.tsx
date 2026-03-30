import { AlertTriangle } from "lucide-react";

import type { Expense } from "@/entities/expense";
import { Modal } from "@/shared/ui/Modal";
import { Button } from "@/shared/ui/Button";

import { useDeleteExpense } from "../model/useDeleteExpense";

interface DeleteExpenseModalProps {
  expense: Expense;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteExpenseModal = ({ expense, isOpen, onClose }: DeleteExpenseModalProps) => {
  const { deleteExpense, isPending } = useDeleteExpense();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Удалить расход">
      <div className="flex flex-col items-center gap-6 px-2 pt-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <p className="text-lg text-slate-800">
            Вы действительно хотите удалить расход «{expense.name}»?
          </p>
          <p className="text-sm text-slate-500">
            Сумма {expense.sum} будет исключена из истории и пересчитает остаток конверта.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3">
          <Button
            title={isPending ? "Удаление..." : "Удалить"}
            bg="primary"
            disabled={isPending}
            onClick={async () => {
              if (!expense.id) return;
              await deleteExpense(expense.id);
              onClose();
            }}
          />
          <Button title="Отменить" bg="white" text="slate-700" onClick={onClose} />
        </div>
      </div>
    </Modal>
  );
};
