import type { Convert } from '@/entities/convert/model/types';

export type ConvertMetrics = {
  balance: number;
  limit: number | null;
  spent: number;
  goal: number;
  percentage: () => number;
  goal_percentage: number;
  remaining_to_goal: number;
  returnPercentage: number; // ROI %
  absoluteReturn: number;   // P/L
  isProfit: boolean;
  isLoss: boolean;
  isNeutral: boolean;
};

export function computeConvertMetrics(convert: Convert): ConvertMetrics {
  const typeCode = convert.type?.code ?? convert.type_code;

  const safeNum = (v: unknown, fallback = 0): number => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const balance = safeNum(convert.current_balance ?? convert.initial_amount);
  const limit = safeNum(convert.target_amount, null);
  const totalOut = safeNum(convert.total_out);
  const spent = totalOut;

  const percentage = (): number => {
    if (limit !== null && limit > 0) {
      const pct = (balance / limit) * 100;
      return Math.round(Math.min(100, Math.max(0, pct)));
    }
    return 100;
  };

  // --- saving goal only ---
  const target = safeNum(convert.target_amount);
  const remaining_to_goal = typeCode === 'saving' ? Math.max(0, target - balance) : 0;
  const goal_percentage =
    typeCode === 'saving' && target > 0
      ? Math.min(100, Math.max(0, (balance / target) * 100))
      : 100;
  const goal = typeCode === 'saving' ? remaining_to_goal : 0;

  // --- investment stats ---
  const initial = safeNum(convert.initial_amount);
  const current = safeNum(convert.balance ?? convert.initial_amount);
  const absoluteReturn = current - initial;
  const returnPercentage = initial > 0 ? (absoluteReturn / initial) * 100 : 0;
  const isProfit = absoluteReturn > 0;
  const isLoss = absoluteReturn < 0;
  const isNeutral = absoluteReturn === 0;

  return {
    balance,
    limit,
    spent,
    goal,
    percentage,
    goal_percentage,
    remaining_to_goal,
    returnPercentage,
    absoluteReturn,
    isProfit,
    isLoss,
    isNeutral,
  };
}
