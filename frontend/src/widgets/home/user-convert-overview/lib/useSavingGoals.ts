import type { Convert } from "@/entities/convert/model/types";
import { formatPrice } from "@/shared/utils/formatPrice";
import { computePercent } from "./computeProgress";
import { useUserConverts } from "@/features/converts/get-user-converts-limits/model/useConverts";

export interface SavingGoalItem {
  id: number;
  name: string;
  saved: number;
  target: number;
  savedLabel: string;
  targetLabel: string;
  progress: number | null; // percent 0..100 or null if no target
}

export const useSavingGoals = () => {
  const { converts, isLoading, error } = useUserConverts();

  const goals: SavingGoalItem[] = (converts || [])
    .filter((c: Convert) => c.type_code === "saving")
    .map((c) => {
      const saved = c.current_balance;
      const target = c.target_amount;
      const progress = computePercent(saved, target);
      const savedLabel = formatPrice(saved) ?? saved.toLocaleString("ru-RU");
      const targetLabel =
        target && target > 0
          ? formatPrice(target) ?? target.toLocaleString("ru-RU")
          : "Без цели";

      return {
        id: c.id,
        name: c.name,
        saved,
        target,
        savedLabel,
        targetLabel,
        progress,
      };
    });

  return { goals, isLoading, error };
};

