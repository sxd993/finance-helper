import { ConvertOverview } from "@/widgets/home/convert-overview";
import { HomeDashboard } from "@/widgets/home/home-dashboard";

export const HomePage = () => {

  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto pt-5 pb-20">
      <HomeDashboard />
      <ConvertOverview />
    </div>
  );
};
