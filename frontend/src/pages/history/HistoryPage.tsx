import { useState } from "react";
import { History } from "lucide-react";

import type { OperationFilter } from "@/entities/operation";
import { HistoryFilters, HistoryOperationsList } from "@/features/history";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { SectionTitle } from "@/shared/ui/SectionTItle";

export const HistoryPage = () => {
  useScrollToTop();
  const [filter, setFilter] = useState<OperationFilter>("all");

  return (
    <div className="app-page-container flex flex-col gap-5">
      <SectionTitle
        title="История"
        subtitle="Расходы и пополнения конвертов"
        icon={<History className="w-6 h-6 text-primary" />}
      />
      <HistoryFilters value={filter} onChange={setFilter} />
      <HistoryOperationsList operationType={filter} />
    </div>
  );
};
