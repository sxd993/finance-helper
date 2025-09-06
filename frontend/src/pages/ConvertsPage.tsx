import { useConverts } from "../shared/hooks/useConverts"

export const ConvertsPage = () => {
  const { converts, isLoading, error } = useConverts();
  if (isLoading) {
    return <p>Загрузка</p>
  }
  return (
    <div>
      Здесь будут конверты
    </div>
  )
}