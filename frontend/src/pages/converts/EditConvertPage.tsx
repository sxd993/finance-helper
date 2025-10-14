import { useParams } from "react-router-dom";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { ConvertTypeBalance } from "@/features/edit-convert/ui/EditConvertBalance";

export const EditConvertPage = () => {
  useScrollToTop();
  const { type_code } = useParams<{ type_code: string }>();

  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto pt-5 pb-20">
      <ConvertTypeBalance/>
    </div>
  );
};

