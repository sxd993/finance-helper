import { ConvertOverview } from "@/widgets/convert-overview";
import { Dashboard } from "@/widgets/dashboard";

export const HomePage = () => {

  return (
    <div className="min-h-screen flex flex-col gap-5 max-w-3xl mx-auto">
      <Dashboard />
      <ConvertOverview />
    </div>
  );
};
