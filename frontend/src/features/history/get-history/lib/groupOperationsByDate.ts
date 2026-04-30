import { format } from "date-fns";
import { ru } from "date-fns/locale";

import type { Operation } from "@/entities/operation";

export interface OperationGroup {
  label: string;
  items: Operation[];
  timestamp: number;
}

export const groupOperationsByDate = (operations: Operation[]): OperationGroup[] => {
  const groups = new Map<string, OperationGroup>();

  for (const operation of operations) {
    const date = new Date(operation.occurred_at);
    const valid = !Number.isNaN(date.getTime());
    const key = valid ? format(date, "yyyy-MM-dd") : String(operation.occurred_at);
    const label = valid ? format(date, "d MMMM yyyy", { locale: ru }) : "Неизвестная дата";

    if (!groups.has(key)) {
      groups.set(key, { label, items: [], timestamp: valid ? date.getTime() : 0 });
    }

    groups.get(key)!.items.push(operation);
  }

  return [...groups.values()]
    .map((group) => ({
      label: group.label,
      items: group.items.sort((a, b) => b.occurred_at - a.occurred_at),
      timestamp: group.timestamp,
    }))
    .sort((a, b) => b.timestamp - a.timestamp);
};

