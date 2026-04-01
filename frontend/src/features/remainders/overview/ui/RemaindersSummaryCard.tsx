import { ArrowRightLeft } from "lucide-react";

import { formatPrice } from "@/shared/utils/formatPrice";
import { Button } from "@/shared/ui/Button";
import type { RemaindersSummary } from "@/entities/remainders";

interface RemaindersSummaryCardProps {
  summary: RemaindersSummary;
  onOpen: () => void;
}

export const RemaindersSummaryCard = ({ summary, onOpen }: RemaindersSummaryCardProps) => {
  return (
    <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,var(--color-secondary-dark)_0%,var(--color-secondary)_100%)] shadow-[0_20px_60px_-35px_rgba(20,184,166,0.65)]">
      <div className="rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] px-6 py-6 text-white">
        <div className="space-y-3">
          <div className="space-y-3">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
              Баланс остатков
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-between items-center">
          <div>
            <p className="text-sm text-white/80">Доступно к переводу</p>
            <p className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              {formatPrice(summary.total_amount)}
            </p>
          </div>
          <Button
            title="Перераспределить"
            onClick={onOpen}
            disabled={summary.total_amount <= 0}
            className="flex justify-center gap-4 h-1/2"
            bg="white"
            text="slate-700"
            size="sm"
            leftIcon={<ArrowRightLeft className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  );
};
