import type { OverviewSummary } from "../lib/buildOverviewSummary";

interface OverviewSummaryCardProps {
  summary: OverviewSummary;
}

export const OverviewSummaryCard = ({ summary }: OverviewSummaryCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Общий бюджет</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{summary.formattedLimit}</p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Свободно к распределению</span>
          <span className={`text-xl font-semibold ${summary.totalAvailable > 0 ? "text-emerald-600" : "text-slate-700"}`}>
            {summary.formattedAvailable}
          </span>
        </div>
      </div>
    </div>
  );
};
