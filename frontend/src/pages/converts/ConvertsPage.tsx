import { ConvertList } from '@entities/convert/ui/ConvertList';
import { useConverts } from '@entities/convert/model/hooks';

export const ConvertsPage = () => {
  const { converts, isLoading } = useConverts();

  if (isLoading) {
    return <p>Загрузка</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="flex flex-col gap-6 pt-4">
        <ConvertList converts={converts} />
      </div>
    </div>
  );
};
