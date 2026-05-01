import { OperationListCard, type OperationFilter } from "@/entities/operation";
import { Error, Loading } from "@/shared/ui/states";
import { useHistoryOperations } from "../model/useHistoryOperations";

interface HistoryOperationsListProps {
  operationType: OperationFilter;
}

export const HistoryOperationsList = ({ operationType }: HistoryOperationsListProps) => {
  const { operationGroups, isLoading, error } = useHistoryOperations(operationType);

  if (isLoading) return <Loading title="Загрузка истории..." />;
  if (error) return <Error error_name="Ошибка при загрузке истории" />;
  if (operationGroups.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        История операций пока пустая
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        {operationGroups.map(({ label, items }) => (
          <section key={label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 px-1">
              <div className="text-sm font-medium text-slate-500">{label}</div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div className="flex flex-col divide-y divide-slate-100 bg-white">
                {items.map((operation) => (
                  <OperationListCard key={operation.id} operation={operation} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
};
