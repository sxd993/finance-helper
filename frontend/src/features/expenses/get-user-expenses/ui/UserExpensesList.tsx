import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";

import { ExpenseListCard, type Expense } from "@entities/expense";
import { DeleteExpenseModal } from "@/features/expenses/delete-expense";
import { EditExpenseModal } from "@/features/expenses/edit-expense";
import { Error, Loading } from "@/shared/ui/states";

import { useUserExpenses } from "../model/useUserExpenses";
import { UserExpensesListEmpty } from "./states/UserExpensesListEmpty";

export const UserExpensesList = () => {
    const { expenseGroups, isLoading, error } = useUserExpenses();
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

    if (isLoading) return <Loading title="Загрузка расходов..." />;
    if (error) return <Error error_name="Ошибка при загрузке расходов" />;
    const isEmpty = expenseGroups.length === 0;

    if (isEmpty) {
        return <UserExpensesListEmpty />;
    }

    return (
        <>
            <div className="flex flex-col gap-3">
                {expenseGroups.map(({ label, items }) => (
                    <div key={label} className="flex flex-col gap-2 overflow-hidden rounded-2xl">
                        <div className="text-lg text-start text-black">{label}</div>
                        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
                            {items.map((expense) => (
                                <ExpenseListCard
                                    key={expense.id ?? `${expense.name}-${expense.date}`}
                                    expense={expense}
                                    actions={
                                        expense.id ? (
                                            <Menu as="div" className="relative">
                                                <MenuButton
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                                                    aria-label={`Открыть меню расхода ${expense.name}`}
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
                                                            onClick={() => setExpenseToEdit(expense)}
                                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 transition data-[focus]:bg-slate-100"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            <span>Редактировать</span>
                                                        </button>
                                                    </MenuItem>
                                                    <MenuItem>
                                                        <button
                                                            type="button"
                                                            onClick={() => setExpenseToDelete(expense)}
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
                ))}
            </div>

            {expenseToEdit && (
                <EditExpenseModal
                    expense={expenseToEdit}
                    isOpen={Boolean(expenseToEdit)}
                    onClose={() => setExpenseToEdit(null)}
                />
            )}

            {expenseToDelete && (
                <DeleteExpenseModal
                    expense={expenseToDelete}
                    isOpen={Boolean(expenseToDelete)}
                    onClose={() => setExpenseToDelete(null)}
                />
            )}
        </>
    );
};
