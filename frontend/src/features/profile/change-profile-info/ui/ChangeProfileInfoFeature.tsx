import { Button } from "@/shared/ui/Button";
import { SectionTitle } from "@/shared/ui/SectionTItle";
import { UserRound } from "lucide-react";

export const ChangeProfileInfoFeature = () => {
  return (
    <div className="rounded-2xl">
      <SectionTitle title="Профиль" icon={<UserRound size={20} className="text-primary" />} />
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-slate-500">Имя</label>
          <input
            type="text"
            defaultValue="Владимир"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-slate-500">Логин</label>
          <input
            type="text"
            defaultValue="volodya123"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-slate-500">Email</label>
          <input
            type="email"
            defaultValue="volodya123@mail.ru"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-primary"
          />
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
