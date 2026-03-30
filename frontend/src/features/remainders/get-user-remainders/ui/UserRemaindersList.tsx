import { RemainderCard } from "@/entities/remainders/ui/RemainderCard";
import { Error, Loading } from "@/shared/ui/states";

import { useUserRemainders } from "../model/useUserRemainders";
import { UserRemaindersListEmpty } from "./states/UserRemaindersListEmpty";

export const UserRemaindersList = () => {
  const { remainders, isLoading, error } = useUserRemainders();

  if (isLoading) return <Loading title="Загрузка остатков..." />;
  if (error) return <Error error_name="Ошибка при загрузке остатков" />;
  if (remainders.length === 0) return <UserRemaindersListEmpty />;

  return (
    <div className="flex flex-col gap-3">
      {remainders.map((remainder) => (
        <RemainderCard key={remainder.id} remainder={remainder} />
      ))}
    </div>
  );
};
