import { Link, useLocation } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react';

import { AddExpenseForm } from '@/features/expenses/add-expenses/ui/AddExpenseForm';
import { ReplenishConvertForm } from '@/features/converts/replenish-convert';
import { Modal } from '@/shared/ui/Modal';
import { useModal } from '@/shared/ui/Modal/model/useModal';
import { navigationItems } from '../model/config';

export const Navigation = () => {
    const location = useLocation();
    const actionModal = useModal("navigation-action-select");
    const expenseModal = useModal("navigation-add-expense");
    const replenishModal = useModal("navigation-add-replenishment");

    // Функция для определения активного состояния
    const isActive = (path: string): boolean => location.pathname === path;

    const openExpense = () => {
        actionModal.close();
        expenseModal.open();
    };

    const openReplenishment = () => {
        actionModal.close();
        replenishModal.open();
    };

    return (
        <>
            <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg">
                <div className="app-shell-container grid grid-cols-5 items-center">
                    {navigationItems.map((item, index) => {
                        const active = isActive(item.path);

                        return (
                            <div key={item.id} className="contents">
                                {index === 2 && (
                                    <div className="flex min-h-[64px] items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={actionModal.open}
                                            aria-label="Добавить операцию"
                                            className="flex h-14 w-14 -translate-y-4 items-center justify-center rounded-full bg-secondary text-white shadow-lg ring-4 ring-white transition hover:bg-secondary-dark"
                                        >
                                            <Plus className="h-7 w-7" />
                                        </button>
                                    </div>
                                )}
                                <div className="flex min-h-[64px] flex-col items-center justify-center">
                                    <Link
                                        to={item.path}
                                        className={`flex flex-col items-center p-2 text-center text-wrap transition-colors duration-200 ${active
                                            ? 'text-secondary'
                                            : 'text-gray-500 hover:text-secondary'
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="text-xs font-medium">{item.label}</span>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </footer>

            <Modal
                isOpen={actionModal.isOpen}
                onClose={actionModal.close}
                title="Добавить операцию"
                widthClassName="max-w-md"
            >
                <div className="grid gap-3 pt-4">
                    <button
                        type="button"
                        onClick={openExpense}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <ArrowDownLeft className="h-5 w-5" />
                        </span>
                        <span>
                            <span className="block text-sm font-semibold text-slate-900">Расход</span>
                            <span className="block text-sm text-slate-500">Списать из необходимого или желаний</span>
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={openReplenishment}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <ArrowUpRight className="h-5 w-5" />
                        </span>
                        <span>
                            <span className="block text-sm font-semibold text-slate-900">Приход</span>
                            <span className="block text-sm text-slate-500">Пополнить накопления или инвестиции</span>
                        </span>
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={expenseModal.isOpen}
                onClose={expenseModal.close}
                title="Добавить расход"
                widthClassName="max-w-2xl"
            >
                <div className="pt-4">
                    <AddExpenseForm onSuccess={expenseModal.close} />
                </div>
            </Modal>

            <Modal
                isOpen={replenishModal.isOpen}
                onClose={replenishModal.close}
                title="Добавить приход"
                widthClassName="max-w-2xl"
            >
                <div className="pt-4">
                    <ReplenishConvertForm onSuccess={replenishModal.close} />
                </div>
            </Modal>
        </>
    );
};
