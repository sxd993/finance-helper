import { useEffect, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { Convert } from "@/entities/convert";
import type { ReplenishFormValues } from "../model/types";
import { filterConvertsBySource } from "./targetConverts";

export const useConvertSelection = ({
  form,
  converts,
  sourceTypeValue,
}: {
  form: UseFormReturn<ReplenishFormValues>;
  converts: Convert[] | null;
  sourceTypeValue: string;
}) => {
  const convertIdValue = form.watch("convertId");

  const eligibleConverts = useMemo(
    () => filterConvertsBySource(converts, sourceTypeValue),
    [converts, sourceTypeValue],
  );

  useEffect(() => {
    if (!eligibleConverts.length) {
      form.setValue("convertId", "");
      return;
    }

    const fallback = eligibleConverts[0];
    const hasSelected = eligibleConverts.some(
      (convert) => String(convert.id) === convertIdValue,
    );
    if (!hasSelected) {
      form.setValue("convertId", String(fallback.id));
    }
  }, [eligibleConverts, convertIdValue, form]);


  const selectedConvert =
    eligibleConverts.find((convert) => String(convert.id) === convertIdValue) ?? null;

  return {
    eligibleConverts,
    selectedConvert,
  };
};
