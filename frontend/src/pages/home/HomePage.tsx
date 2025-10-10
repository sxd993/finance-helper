import { ConvertOverview } from "@/widgets/convert-overview";
import { HomeDashboard } from "@/widgets/home-dashboard";

export const HomePage = () => {

  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto pt-5">
      <HomeDashboard />
      <ConvertOverview />
      <div className="flex flex-col">
        <h2 className="text-lg mb-4">Быстрые действия</h2>
      </div>
    </div>
  );
};
