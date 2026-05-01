import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";

import { OperationListCard, toExpense, type Operation, type OperationFilter } from "@/entities/operation";
import { DeleteExpenseModal } from "@/features/expenses/delete-expense";
import { EditExpenseModal } from "@/features/expenses/edit-expense";
import { Error, Loading } from "@/shared/ui/states";
import { useHistoryOperations } from "../model/useHistoryOperations";

interface HistoryOperationsListProps {
  operationType: OperationFilter;
}

export const HistoryOperationsList = ({ operationType }: HistoryOperationsListProps) => {
  const { operationGroups, isLoading, error } = useHistoryOperations(operationType);
  const [operationToEdit, setOperationToEdit] = useState<Operation | null>(null);
  const [operationToDelete, setOperationToDelete] = useState<Operation | null>(null);

  if (isLoading) return <Loading title="Загрузка истории..." />;
  if (error) return <Error error_name="Ошибка при загрузке истории" />;
  if (operationGroups.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        История операций пока пустая
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        {operationGroups.map(({ label, items }) => (
          <section key={label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 px-1">
              <div className="text-sm font-medium text-slate-500">{label}</div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div className="flex flex-col divide-y divide-slate-100 bg-white">
              {items.map((operation) => (
                <OperationListCard
                  key={operation.id}
                  operation={operation}
                  actions={
                    operation.type === "expense" ? (
                      <Menu as="div" className="relative">
                        <MenuButton
                          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          aria-label={`Открыть меню операции ${operation.title}`}
                        >
                          <Ellipsis className="h-4 w-4" />
                        </MenuButton>
                        <MenuItems
                          anchor="bottom end"
                          className="z-20 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-1 shadow-lg outline-none"
                        >
                          <MenuItem>
                            <button
                              type="button"
                              onClick={() => setOperationToEdit(operation)}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 transition data-[focus]:bg-slate-100"
                            >
                              <Pencil className="h-4 w-4" />
                              <span>Редактировать</span>
                            </button>
                          </MenuItem>
                          <MenuItem>
                            <button
                              type="button"
                              onClick={() => setOperationToDelete(operation)}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 transition data-[focus]:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Удалить</span>
                            </button>
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                    ) : null
                  }
                />
              ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {operationToEdit && (
        <EditExpenseModal
          expense={toExpense(operationToEdit)}
          isOpen={Boolean(operationToEdit)}
          onClose={() => setOperationToEdit(null)}
        />
      )}

      {operationToDelete && (
        <DeleteExpenseModal
          expense={toExpense(operationToDelete)}
          isOpen={Boolean(operationToDelete)}
          onClose={() => setOperationToDelete(null)}
        />
      )}
    </>
  );
};
