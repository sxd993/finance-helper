import { Button } from "@/shared/ui/Button";
import { SectionTitle } from "@/shared/ui/SectionTItle";
import { Wallet } from "lucide-react";

export const ChangeIncome = () => {
  return (
    <div className="rounded-2xl mb-5">
      <SectionTitle title="Текущий доход" icon={<Wallet size={20} className="text-primary" />} />

      <div className="mt-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center rounded-2xl border border-slate-200 px-4 py-3 text-slate-900">
            <span className="text-sm text-slate-500">₽</span>
            <input
              type="number"
              defaultValue="260000"
              className="ml-2 w-full border-none bg-transparent text-lg font-semibold outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
        <Button
          title="Сбросить"
          bg="white"
          text="slate-700"
          className="flex-1 border border-slate-200"
        />
        <Button
          bg='primary'
          title="Сохранить"
          className="flex-1"
        />
      </div>
    </div>
  );
};
