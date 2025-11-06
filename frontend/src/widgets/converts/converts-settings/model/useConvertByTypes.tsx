import { useConvertOverview } from "@/features/converts/get-converts/model/hooks/useConvertOverview";
import { useUserConverts } from "@/features/converts/get-user-converts/models/useUserConverts";
import { useParams } from "react-router-dom";

export const useConvertByTypes = () => {
    const { type_code } = useParams<{ type_code: string }>();
    const { convertOverview, isLoading, error } = useConvertOverview();
    const { converts } = useUserConverts();
    console.log(convertOverview)

    // ищем группу по типу
    const convert_overview_group = convertOverview?.find(
        (convert) => convert.code === type_code
    );

    // список конвертов этого типа
    const convert_group = converts?.filter(
        (convert) => convert.type_code === type_code
    );

    return {
        convert_overview_group,
        convert_group,
        isLoading,
        error,
    };
};
