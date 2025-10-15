import { useConvertOverview, useConverts } from "@/entities/convert";
import { useParams } from "react-router-dom";

export const useConvertGroups = () => {
  const { type_code } = useParams<{ type_code: string }>();
  const { convertOverview, isLoading, error } = useConvertOverview();
  const { converts } = useConverts();

  const convert_overview_group = (() => {
    if (!convertOverview || !type_code) return undefined;
    const map = Object.fromEntries(convertOverview);
    return map[type_code];
  })();

  const convert_group = converts?.filter(
    convert => convert.type.code === type_code
  );

  return {
    convert_overview_group,
    convert_group,
    isLoading,
    error,
  };
};
