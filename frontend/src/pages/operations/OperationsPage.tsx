import { useState, type ReactNode } from "react";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

import { ReplenishConvertForm } from "@/features/converts/replenish-convert";
import { AddExpenseForm } from "@/features/expenses/add-expenses/ui/AddExpenseForm";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { SectionTitle } from "@/shared/ui/SectionTItle";

type OperationMode = "expense" | "replenishment";

const operationModes: Array<{
  value: OperationMode;
  title: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    value: "expense",
    title: "Списание средств",
    description: "Записать трату из конвертов необходимого или желаний.",
    icon: <ArrowDownLeft className="h-5 w-5" />,
  },
  {
    value: "replenishment",
    title: "Зачисление средств",
    description: "Пополнить накопления или инвестиции доступными средствами.",
    icon: <ArrowUpRight className="h-5 w-5" />,
  },
];

export const OperationsPage = () => {
  useScrollToTop();
  const [mode, setMode] = useState<OperationMode>("expense");

  return (
    <div className="app-page-container flex flex-col gap-6 pb-6">
      <SectionTitle
        title="Финансовые операции"
        subtitle="Выберите действие и заполните форму"
        icon={<Wallet className="h-6 w-6 text-primary" />}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {operationModes.map((item) => {
          const isActive = item.value === mode;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setMode(item.value)}
              className={`rounded-3xl border p-4 text-left transition ${
                isActive
                  ? "border-secondary bg-secondary/10 shadow-sm"
                  : "border-slate-200 bg-white hover:border-secondary/40 hover:bg-slate-50"
              }`}
            >
              <div
                className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${
                  item.value === "expense"
                    ? "bg-red-50 text-red-500"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {item.icon}
              </div>
              <div className="text-base font-semibold text-slate-900">{item.title}</div>
              <div className="mt-1 text-sm text-slate-500">{item.description}</div>
            </button>
          );
        })}
      </div>

      {mode === "expense" ? <AddExpenseForm /> : <ReplenishConvertForm />}
    </div>
  );
};
