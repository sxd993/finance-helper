import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { SwitchConvertTabs } from "@/features/ui/switch-convert-tabs/ui/SwitchConvertTabs";
import { ConvertOverview } from "@/widgets/converts/converts-overview/ui/ConvertOverview";
import { ConvertList } from "@/widgets/converts/converts-list/ui/ConvertList";

export const HomePage = () => {
  useScrollToTop();

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto pt-5 pb-20 p-4">
      <SwitchConvertTabs />
      <ConvertOverview />
      <ConvertList />
    </div>
  );
};
