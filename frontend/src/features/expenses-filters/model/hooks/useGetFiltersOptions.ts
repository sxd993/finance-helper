import { useMemo } from "react";
import { useConvertTypes, useConverts } from "@/entities/convert";
import { getFilterOptions } from "../../lib/getFilterOptions";
import { getSelectStyles } from "../../lib/getSelectStyles";

export const useGetFiltersOptions = () => {
  const { convert_types } = useConvertTypes();
  const { converts } = useConverts();

  const filterOptions = useMemo(
    () => getFilterOptions({ convert_types, converts }),
    [convert_types, converts]
  );

  const selectStyles = useMemo(() => getSelectStyles(), []);

  return { filterOptions, selectStyles };
};
