
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { EditConvertBalance, EditConvertList } from "@/features/edit-convert";

export const EditConvertPage = () => {
  useScrollToTop();

  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto pt-5 pb-20">
      <EditConvertBalance />
      <EditConvertList/>
    </div>
  );
};

