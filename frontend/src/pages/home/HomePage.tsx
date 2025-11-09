import { UserConvertOverview } from "@/widgets/home/user-convert-overview";
import { SavingInvestmentOverview } from "@/widgets/home/saving-investment-overview";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { QuickActionGrids } from "@/widgets/home/quick-actions";

export const HomePage = () => {
  useScrollToTop();

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto pt-5 pb-20 p-4">
      <UserConvertOverview />
      <SavingInvestmentOverview />
      <QuickActionGrids />
    </div>
  );
};
