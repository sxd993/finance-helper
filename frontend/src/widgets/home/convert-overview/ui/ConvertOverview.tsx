import { ConvertCard } from "./ConvertCard";
import { useConvertOverview } from "../model/useConvertOverview";
import { ConvertOverviewEmpty } from "./ConvertOverviewEmpty";
import { SectionTitle } from "@/shared/ui/SectionTItle";
import { Info } from "lucide-react";

export const ConvertOverview = () => {
  const { convertOverview, isLoading } = useConvertOverview();

  if (isLoading) return <p>Загрузка...</p>;

  // если с бэка пришёл null — значит, конвертов нет
  if (!convertOverview) {
    return <ConvertOverviewEmpty />;
  }


  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5">
        <SectionTitle
          title="Общая информация в конвертах"
          icon={<Info className="w-6 h-6 text-primary" />}
        />
        {convertOverview.map(([key, data]) => (
          <ConvertCard
            key={key}
            type={data.info.title}
            currentSum={data.currentSum}
            totalSum={data.totalSum}
          />
        ))}
      </div>
    </div>
  );
};
