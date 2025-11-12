
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { useUserConverts } from "@/features/converts/get-user-converts/models/useUserConverts";
import type { ConvertTab } from "@/features/ui/switch-convert-tabs/store/ConvertTabs.slice";
import { ConvertByTypeCard } from "@/widgets/converts/converts-settings/ui/ConvertByTypeCard";
import { ReplenishConvertForm } from "@/features/converts/replenish-convert";
import { Loading } from "@/shared/ui/states/Loading";

const allowedTypeCodes: ConvertTab[] = ["important", "wishes", "saving", "investment"];

const isConvertType = (value: string | undefined): value is ConvertTab =>
  allowedTypeCodes.includes(value as ConvertTab);

export const ConvertSettings = () => {
  useScrollToTop();
  const params = useParams<{ type_code: string }>();
  const typeCode = isConvertType(params.type_code) ? params.type_code : null;

  const { converts, isLoading: isConvertsLoading } = useUserConverts();

  const isLoading = isConvertsLoading

  const filteredConverts = useMemo(
    () => (typeCode ? (converts ?? []).filter((convert) => convert.type_code === typeCode) : []),
    [converts, typeCode],
  );


  const canReplenishCurrent = typeCode === "saving" || typeCode === "investment";

  if (!typeCode) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 pt-10">
        <p className="text-lg font-semibold text-slate-900">Неизвестная категория</p>
        <p className="text-sm text-slate-500">Проверьте корректность ссылки</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto pt-5 pb-20 p-4">
        <Loading title="Загружаем конверты..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto pt-5 pb-20 p-4">
      {canReplenishCurrent && filteredConverts.length > 0 && (
        <ReplenishConvertForm
          converts={filteredConverts}
          targetTypeCodes={[typeCode]}
          title="Пополнить конверт"
          description="Добавьте дополнительные средства в конверты этой категории"
        />
      )}

      <div className="flex flex-col gap-4">
        {filteredConverts.map((convert) => (
          <ConvertByTypeCard key={convert.id} convert={convert} />
        ))}

        {filteredConverts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
            В этой категории пока нет конвертов. Добавьте первый в разделе «Конверты».
          </div>
        )}
      </div>
    </div>
  );
};
