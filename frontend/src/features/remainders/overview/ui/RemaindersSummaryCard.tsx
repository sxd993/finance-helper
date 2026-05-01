import { ArrowRightLeft } from "lucide-react";

import { formatPrice } from "@/shared/utils/formatPrice";
import type { RemaindersSummary } from "@/entities/remainders";

interface RemaindersSummaryCardProps {
  summary: RemaindersSummary;
  onOpen: () => void;
}

export const RemaindersSummaryCard = ({ summary, onOpen }: RemaindersSummaryCardProps) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6 sm:py-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Доступно к переводу</p>
          <p className="text-3xl font-semibold text-slate-950 sm:text-4xl">
            {formatPrice(summary.total_amount)}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          disabled={summary.total_amount <= 0}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ArrowRightLeft className="h-4 w-4" />
          <span>Распределить</span>
        </button>
      </div>
    </div>
  );
};
