import { ConvertCard } from "./ConvertCard";
import { useConvertOverview } from "../model/useConvertOverview";
import { ConvertOverviewEmpty } from "./ConvertOverviewEmpty";

export const ConvertOverview = () => {
  const { convertOverview, isLoading } = useConvertOverview();

  if (isLoading) return <p>Загрузка...</p>;

  // если с бэка пришёл null — значит, конвертов нет
  if (!convertOverview) {
    return <ConvertOverviewEmpty />;
  }

  console.log(convertOverview);

  return (
    <div className="flex flex-col">
      <h2 className="text-lg mb-4">Общая информация о конвертах</h2>
      <div className="flex flex-col gap-5">
        {convertOverview.map(([key, data]) => (
          <ConvertCard
            key={key}
            type={data.meta.title}
            currentSum={data.currentSum}
            totalSum={data.totalSum}
          />
        ))}
      </div>
    </div>
  );
};
