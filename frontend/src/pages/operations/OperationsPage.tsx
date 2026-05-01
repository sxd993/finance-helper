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
  const activeMode = operationModes.find((item) => item.value === mode) ?? operationModes[0];

  return (
    <div className="app-page-container flex flex-col gap-6 pb-6">

      <div className="flex flex-col gap-3 sm:hidden">
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-1">
          {operationModes.map((item) => {
            const isActive = item.value === mode;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setMode(item.value)}
                className={`flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "bg-transparent text-slate-600"
                }`}
              >
                <span
                  className={isActive ? "text-white" : item.value === "expense" ? "text-red-500" : "text-emerald-600"}
                >
                  {item.icon}
                </span>
                <span>{item.value === "expense" ? "Списание" : "Зачисление"}</span>
              </button>
            );
          })}
        </div>

        <p className="px-1 text-sm leading-5 text-slate-500">{activeMode.description}</p>
      </div>

      <div className="hidden gap-3 sm:grid sm:grid-cols-2">
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
