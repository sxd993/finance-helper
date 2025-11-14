import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import type { UseFormReturn } from "react-hook-form";

import type { AppDispatch } from "@/app/providers/StoreProvider/config/store";
import { setSourceType } from "../store";
import type { ReplenishFormValues, ReplenishSourceType } from "../model/types";
import type { UserConvertLimit } from "@/features/converts/get-user-converts-limits/model/types";
import {
  buildSourceTypeOptions,
  getAvailableRemainder,
  isSupportedSourceType,
  normalizeSourceType,
} from "./sourceType";

export const useSourceTypeController = ({
  form,
  storedSourceType,
  limits,
}: {
  form: UseFormReturn<ReplenishFormValues>;
  storedSourceType: ReplenishSourceType | null;
  limits: UserConvertLimit[] | null;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const sourceTypeOptions = useMemo(() => buildSourceTypeOptions(limits), [limits]);
  const sourceTypeValue = form.watch("sourceType");
  const normalized = useMemo(
    () => normalizeSourceType(sourceTypeOptions, storedSourceType),
    [sourceTypeOptions, storedSourceType],
  );

  useEffect(() => {
    const currentValue = form.getValues("sourceType");
    if (normalized !== currentValue) {
      form.setValue("sourceType", normalized);
    }

    const normalizedStore = normalized === "" ? null : normalized;
    if (normalizedStore !== storedSourceType) {
      dispatch(setSourceType(normalizedStore));
    }
  }, [normalized, form, dispatch, storedSourceType]);

  const handleSourceTypeChange = useCallback(
    (nextRaw: string) => {
      const nextValue = isSupportedSourceType(nextRaw) ? nextRaw : "";
      form.setValue("sourceType", nextValue, { shouldDirty: true, shouldTouch: true });
      dispatch(setSourceType(nextValue === "" ? null : nextValue));
    },
    [dispatch, form],
  );

  const availableRemainder = getAvailableRemainder(sourceTypeOptions, sourceTypeValue);

  return {
    sourceTypeOptions,
    sourceTypeValue,
    handleSourceTypeChange,
    availableRemainder,
  };
};
