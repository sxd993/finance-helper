import { useConvertOverview } from "@/entities/convert";
import { useParams } from "react-router-dom";

export const useEditConvertBalance = () => {
  const { type_code } = useParams<{ type_code: string }>();
  const { convertOverview, isLoading, error } = useConvertOverview();

  const group = (() => {
    if (!convertOverview || !type_code) return undefined;
    const map = Object.fromEntries(convertOverview);
    return map[type_code];
  })();

  return { group, isLoading, error };
};
