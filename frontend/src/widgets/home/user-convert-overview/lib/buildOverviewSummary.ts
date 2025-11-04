import type { ConvertGroup } from "@/entities/convert";
import { formatPrice } from "@/shared/utils/formatPrice";

export interface OverviewDistributionSegment {
  code: string;
  title: string;
  amount: number;
  percentage: number;
  formattedAmount: string;
}

export interface OverviewSummary {
  totalAllocated: number;
  totalAvailable: number;
  totalLimit: number;
  allocatedPercent: number;
  formattedAllocated: string;
  formattedAvailable: string;
  formattedLimit: string;
  distribution: OverviewDistributionSegment[];
}

const formatCurrency = (value: number) => formatPrice(value) ?? "0 ₽";

const toNumber = (value: number | string | null | undefined): number => {
  if (value == null) {
    return 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const buildOverviewSummary = (
  overview: ConvertGroup[],
): OverviewSummary => {
  const totals = overview.reduce(
    (acc, convert) => {
      const allocated = toNumber(convert.currentSum);
      const available = toNumber(convert.info.avaliable_limit);

      acc.totalAllocated += allocated;
      acc.totalAvailable += available;
      acc.distribution.push({
        code: convert.code,
        title: convert.info.title,
        amount: allocated,
      });

      return acc;
    },
    { totalAllocated: 0, totalAvailable: 0, distribution: [] as Array<{ code: string; title: string; amount: number }> },
  );

  const totalLimit = totals.totalAllocated + totals.totalAvailable;
  const allocatedPercent = totalLimit > 0 ? Math.min((totals.totalAllocated / totalLimit) * 100, 100) : 0;

  const distribution: OverviewDistributionSegment[] = totals.distribution.map((item) => ({
    ...item,
    percentage: totalLimit > 0 ? (item.amount / totalLimit) * 100 : 0,
    formattedAmount: formatCurrency(item.amount),
  }));

  if (totals.totalAvailable > 0) {
    distribution.push({
      code: "free",
      title: "Свободно",
      amount: totals.totalAvailable,
      percentage: totalLimit > 0 ? (totals.totalAvailable / totalLimit) * 100 : 0,
      formattedAmount: formatCurrency(totals.totalAvailable),
    });
  }

  return {
    totalAllocated: totals.totalAllocated,
    totalAvailable: totals.totalAvailable,
    totalLimit,
    allocatedPercent,
    formattedAllocated: formatCurrency(totals.totalAllocated),
    formattedAvailable: formatCurrency(totals.totalAvailable),
    formattedLimit: formatCurrency(totalLimit),
    distribution,
  };
};

