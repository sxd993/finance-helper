import { ConvertCard } from "./ConvertCard";
import { useConvertOverview } from "@/entities/convert";
import { ConvertOverviewEmpty } from "./ConvertOverviewEmpty";
import { SectionTitle } from "@/shared/ui/SectionTItle";
import { Info } from "lucide-react";

export const ConvertOverview = () => {
  const { convertOverview, isLoading } = useConvertOverview();

  if (isLoading) return <p>Загрузка...</p>;


  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5">
        <SectionTitle
          title="Общая информация"
          icon={<Info className="w-6 h-6 text-primary" />}
        />
        {convertOverview === null
          ? <ConvertOverviewEmpty />
          :
          convertOverview.map(([key, convert]) => (
            <ConvertCard
              key={key}
              type={convert.info?.title ?? key}
              currentSum={convert.currentSum}
              code={convert.info?.code ?? key}
            />)
          )}
      </div>
    </div>
  );
};
