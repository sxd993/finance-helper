import type { Convert } from '@/entities/convert/model/types';

export type ConvertMetrics = {
  balance: number;
  limit: number;
  spent: number;
  goal: number;
  percentage: number;
  goal_percentage: number;
  remaining_to_goal: number;
  // Investment metrics
  returnPercentage: number; // ROI %
  absoluteReturn: number; // P/L
  isProfit: boolean;
  isLoss: boolean;
  isNeutral: boolean;
};

export function computeConvertMetrics(convert: Convert): ConvertMetrics {
  const typeCode = convert.type?.code ?? convert.type_code;

  const balance = Number.isFinite(convert.balance)
    ? Number(convert.balance)
    : Number(convert.current_amount ?? 0);

  const totalOut = Number.isFinite(convert.total_out)
    ? Number(convert.total_out)
    : 0;

  const limit = (() => {
    if (typeCode === 'saving') {
      return typeof convert.target_amount === 'number' ? convert.target_amount : 0;
    }
    return typeof convert.overall_limit === 'number' ? convert.overall_limit : 0;
  })();

  const target = typeof convert.target_amount === 'number' ? convert.target_amount : 0;

  const percentage = limit > 0
    ? Math.min(100, Math.max(0, (balance / limit) * 100))
    : 100;

  const spent = totalOut;

  const remaining_to_goal = typeCode === 'saving'
    ? Math.max(0, target - balance)
    : 0;

  const goal_percentage = typeCode === 'saving' && target > 0
    ? Math.min(100, Math.max(0, (balance / target) * 100))
    : 100;

  const goal = typeCode === 'saving' ? remaining_to_goal : 0;

  const initial = typeof convert.initial_amount === 'number'
    ? convert.initial_amount
    : typeof convert.initial_investment === 'number'
      ? convert.initial_investment
      : 0;

  const current = typeof convert.current_value === 'number'
    ? convert.current_value
    : balance;

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
