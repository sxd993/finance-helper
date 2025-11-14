import type { UserConvertLimit } from "@/features/converts/get-user-converts-limits/model/types";
import { formatTypeCode } from "@/entities/convert/lib/formatTypeCode";

import type { ReplenishSourceType, SourceTypeOption } from "../model/types";
import { SUPPORTED_SOURCE_TYPES } from "./const";

export const buildSourceTypeOptions = (
  limits: UserConvertLimit[] | null,
): SourceTypeOption[] => {
  if (!limits) {
    return [];
  }

  return limits
    .filter((limit) => isSupportedSourceType(limit.typeCode))
    .map((limit) => ({
      value: limit.typeCode as ReplenishSourceType,
      label: formatTypeCode(limit.typeCode),
      remainder: Number(limit.remainderAmount ?? 0),
    }));
};

export const normalizeSourceType = (
  options: SourceTypeOption[],
  stored: ReplenishSourceType | null,
): ReplenishSourceType | "" => {
  if (!options.length) {
    return "";
  }

  if (stored && options.some((option) => option.value === stored)) {
    return stored;
  }

  return options[0].value;
};

export const getAvailableRemainder = (
  options: SourceTypeOption[],
  sourceType: string,
): number => {
  if (!isSupportedSourceType(sourceType)) {
    return 0;
  }

  const entry = options.find((option) => option.value === sourceType);
  return entry ? Math.max(0, entry.remainder) : 0;
};

export const isSupportedSourceType = (value: unknown): value is ReplenishSourceType => {
  return (
    typeof value === "string" &&
    SUPPORTED_SOURCE_TYPES.includes(value as ReplenishSourceType)
  );
};
