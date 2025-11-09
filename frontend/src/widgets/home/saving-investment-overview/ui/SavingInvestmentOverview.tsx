import { Layers, PiggyBank, TrendingUp } from "lucide-react"
import { SectionTitle } from "@/shared/ui/SectionTItle"
import { SavingCardOverview } from "./cards/SavingCardOverview"
import { InvestmentCardOverview } from "./cards/InvestmentCardOverview"
import { useSavingInvestmentOverviewData } from "../model/useSavingInvestmentOverviewData"
import { EmptyMessage } from "./states/EmptyMessage"

export const SavingInvestmentOverview = () => {
  const {
    savingConverts,
    investmentConverts,
    savingTopUpAmount,
    investmentTopUpAmount,
    hasSaving,
    hasInvestment,
    isLoading,
    isEmpty,
  } = useSavingInvestmentOverviewData()

  console.log(investmentConverts)

  if (isEmpty) {
    return (
      <section className="flex flex-col gap-5">
        <SectionTitle
          title="Сбережения и инвестиции"
          icon={<Layers className="w-6 h-6 text-primary" />}
        />
        <EmptyMessage text="У вас пока нет сберегательных и инвестиционных конвертов" />
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-5">
      <SectionTitle
        title="Сбережения и инвестиции"
        icon={<Layers className="w-6 h-6 text-primary" />}
      />

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-600 justify-between">
            <div className="flex gap-1">
              <PiggyBank className="w-5 h-5 text-emerald-500" />
              <p className="text-sm font-medium uppercase tracking-wide text-gray-900">Сбережения</p>
            </div>
            <div>
              {savingTopUpAmount > 0 && (
                <button
                  type="button"
                  className="inline-flex flex-col items-start gap-1 rounded-2xl bg-emerald-500 px-2 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <span>Можно распределить</span>
                </button>
              )}
            </div>
          </div>
          {hasSaving ? (
            <div className="grid gap-4 md:grid-cols-1">
              {savingConverts.map((convert) => (
                <SavingCardOverview key={convert.id} convert={convert} />
              ))}
            </div>
          ) : (
            !isLoading && <EmptyMessage text="Нет сберегательных конвертов" />
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-600 justify-between">
            <div className="flex gap-1">
              <TrendingUp className="w-5 h-5 text-sky-500" />
              <p className="text-sm font-medium uppercase tracking-wide text-gray-900">Инвестиции</p>
            </div>
            {investmentTopUpAmount > 0 && (
              <button
                type="button"
                className="inline-flex flex-col items-start gap-1 rounded-2xl bg-emerald-500 px-2 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <span>Можно распределить</span>
              </button>
            )}
          </div>
          {hasInvestment ? (
            <div className="grid gap-4">
              {investmentConverts.map((convert) => (
                <InvestmentCardOverview key={convert.id} convert={convert} />
              ))}
            </div>
          ) : (
            !isLoading && <EmptyMessage text="Нет инвестиционных конвертов" />
          )}
        </div>
      </div>
    </section>
  )
}
