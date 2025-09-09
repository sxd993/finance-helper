import { ConvertContainer } from "../features/converts/components/ConvertContainer";
import { useConverts } from "../shared/hooks/useConverts"

export const ConvertsPage = () => {
  const { converts, isLoading } = useConverts();
  if (isLoading) {
    return <p>Загрузка</p>
  }
  return (
    <div className="min-h-screen bg-gray-50 w-[100%]">
      <div className="flex flex-col gap-6 pt-4">
        <ConvertContainer converts={converts} />
      </div>
    </div>

  )
}