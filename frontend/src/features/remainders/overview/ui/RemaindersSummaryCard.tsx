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
    <div className="overflow-hidden rounded-[28px] bg-secondary">
      <div className="rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-6 text-white">
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
