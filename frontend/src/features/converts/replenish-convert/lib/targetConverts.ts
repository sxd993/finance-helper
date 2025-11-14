import type { Convert } from "@/entities/convert";

import type { ReplenishSourceType } from "../model/types";

export const filterConvertsBySource = (
  converts: Convert[] | null,
  sourceType: string,
): Convert[] => {
  if (!isReplenishSourceType(sourceType)) {
    return [];
  }

  return (converts ?? []).filter((convert) => convert.type_code === sourceType);
};

const isReplenishSourceType = (value: unknown): value is ReplenishSourceType => {
  return value === "saving" || value === "investment";
};
