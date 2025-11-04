import type { OverviewDistributionSegment } from "../lib/buildOverviewSummary";

interface BudgetDistributionWidgetProps {
  distribution: OverviewDistributionSegment[];
  total: number;
}

const colorMap: Record<string, string> = {
  important: "bg-orange-500",
  wishes: "bg-pink-400",
  saving: "bg-emerald-500",
  investment: "bg-indigo-500",
  free: "bg-slate-300",
};

export const BudgetDistributionWidget = ({ distribution, total }: BudgetDistributionWidgetProps) => {
  const segments = distribution.filter((segment) => segment.amount > 0);

  if (!segments.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-medium text-slate-700">Распределение бюджета</p>
        <p className="text-xs text-slate-500">Показывает долю каждого типа и свободные средства</p>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        {segments.map((segment) => {
          const width = total > 0 ? (segment.amount / total) * 100 : 0;
          return (
            <div
              key={segment.code}
              className={`${colorMap[segment.code] ?? "bg-slate-400"} h-full`}
              style={{ width: `${width}%` }}
            />
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {segments.map((segment) => (
          <div key={segment.code} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
            <span className={`h-2.5 w-2.5 rounded-full ${colorMap[segment.code] ?? "bg-slate-400"}`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700">{segment.title}</p>
              <p className="text-xs text-slate-500">{segment.formattedAmount}</p>
            </div>
            <span className="text-xs font-semibold text-slate-600">
              {segment.percentage > 0 ? `${Math.round(segment.percentage)}%` : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

