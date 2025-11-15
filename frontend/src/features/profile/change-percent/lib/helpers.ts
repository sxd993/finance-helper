import type { ChangePercentFormValues } from "../model/types";

export const normalizePercent = (value?: number | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const sumDistribution = (values: Partial<ChangePercentFormValues>) => {
  const {
    percentImportant = 0,
    percentWishes = 0,
    percentSaving = 0,
    percentInvestment = 0,
  } = values;

  return (
    Number(percentImportant || 0) +
    Number(percentWishes || 0) +
    Number(percentSaving || 0) +
    Number(percentInvestment || 0)
  );
};

export const clampPercent = (value: number) =>
  Math.max(0, Math.min(100, Number(value) || 0));

export const formatPercent = (value: number, fractionDigits = 1) =>
  Number(value || 0).toFixed(fractionDigits);

export const isValidTotal = (total: number) => Math.abs(total - 100) <= 0.01;
