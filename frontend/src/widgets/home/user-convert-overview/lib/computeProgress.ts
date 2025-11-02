export const clampPercent = (value: number) => Math.min(Math.max(value, 0), 100);

export const computePercent = (part: number, whole: number | null | undefined) => {
  if (!whole || whole <= 0) return null;
  return clampPercent((part / whole) * 100);
};

