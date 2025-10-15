
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { ConvertsByTypeBalance } from "@/features/edit-convert";
import { ConvertsByTypeList } from "@/widgets/converts-by-types";

export const ConvertByTypePage = () => {
  useScrollToTop();

  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto pt-5 pb-20">
      <ConvertsByTypeBalance />
      <ConvertsByTypeList />
    </div>
  );
};

