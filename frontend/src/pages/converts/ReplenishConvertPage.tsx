import { ReplenishConvertForm } from "@/features/converts/replenish-convert";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";

export const ReplenishConvertPage = () => {
  useScrollToTop();

  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto pt-5 pb-20 p-4">
      <ReplenishConvertForm />
    </div>
  );
};
