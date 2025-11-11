import { useMemo } from "react";
import { getFilterOptions } from "../../lib/getFilterOptions";
import { getSelectStyles } from "../../lib/getSelectStyles";
import { useUserConverts } from "@/features/converts/get-user-converts/models/useUserConverts";
import { useConvertTypes } from "@/features/converts/get-convert-types/model/useConvertTypes";

export const useGetFiltersOptions = () => {
  const { convert_types } = useConvertTypes();
  const { converts } = useUserConverts();

  const filterOptions = useMemo(
    () => getFilterOptions({ convert_types, converts }),
    [convert_types, converts]
  );

  const selectStyles = useMemo(() => getSelectStyles(), []);

  return { filterOptions, selectStyles };
};
