import { Coins } from "lucide-react";

import { UserRemaindersList } from "@/features/remainders";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { SectionTitle } from "@/shared/ui/SectionTItle";

export const RemaindersPage = () => {
  useScrollToTop();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 pt-5 pb-20">
      <SectionTitle
        title="Остатки"
        subtitle="Просматривайте суммы, которые остались после завершённых циклов"
        icon={<Coins className="w-6 h-6 text-primary" />}
      />
      <UserRemaindersList />
    </div>
  );
};
