import { Button } from "@/shared/ui/Button";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { SectionTitle } from "@/shared/ui/SectionTItle";
import { PieChart } from "lucide-react";

const distributionPresets = [
  {
    label: "Накопления",
    value: 40,
    accent: "bg-emerald-500",
    description: "Откладывайте на крупные цели и подушку безопасности",
  },
  {
    label: "Повседневные расходы",
    value: 35,
    accent: "bg-sky-500",
    description: "Обязательные счета, продукты и транспорт",
  },
  {
    label: "Инвестиции",
    value: 15,
    accent: "bg-amber-500",
    description: "Долгосрочный рост капитала",
  },
  {
    label: "Траты для удовольствия",
    value: 10,
    accent: "bg-pink-500",
    description: "Хобби, путешествия и подарки",
  },
];

export const ChangePercent = () => {
  return (
    <div className="rounded-2xl bg-slate-50 mb-6">
      <SectionTitle
        title="Доли распределения"
        icon={<PieChart size={20} className="text-primary" />}
      />

      <div className="mt-3 space-y-4">
        {distributionPresets.map((preset) => (
          <div key={preset.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${preset.accent}`} />
                <div>
                  <p className="text-sm font-medium text-slate-900">{preset.label}</p>
                  <p className="text-xs text-slate-500">{preset.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={preset.value}
                  className="w-20 rounded-xl border border-slate-200 px-3 py-2 text-right text-sm font-semibold text-slate-900 focus:border-primary focus:outline-none"
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
            </div>
            <div className="mt-3">
              <ProgressBar color={preset.accent} percentage={preset.value} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row">
        <Button
          title="Сбросить"
          bg="white"
          size="sm"
          text="slate-700"
          className="flex-1"
        />
        <Button
          bg="primary"
          title="Сохранить"
          size="sm"
          className="flex-1"
        />
      </div>
    </div>
  );
};
