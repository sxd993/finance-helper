import { useMemo } from "react";

import { useUserConvertsLimits } from "@/features/converts/get-user-converts-limits/model/useUserConvertsLimits";

export const useHasConvertRemainder = (typeCode: string): boolean => {
  const { userConvertsLimits } = useUserConvertsLimits();

  return useMemo(() => {
    if (!typeCode || !userConvertsLimits) {
      return false;
    }
    return userConvertsLimits.some(
      (convert) => convert.typeCode === typeCode && convert.remainderAmount > 0,
    );
  }, [typeCode, userConvertsLimits]);
};
