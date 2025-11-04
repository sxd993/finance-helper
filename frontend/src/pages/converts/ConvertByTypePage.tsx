
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { ConvertsByTypeBalance } from "@/widgets/converts/converts-settings";
import { ConvertsByTypeList } from "@/widgets/converts/converts-settings";

export const ConvertByTypePage = () => {
  useScrollToTop();

  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto pt-5 pb-20 p-4">
      <ConvertsByTypeBalance />
      <ConvertsByTypeList />
    </div>
  );
};

