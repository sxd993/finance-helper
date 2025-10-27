import { useConvertOverview, useConverts } from "@/entities/convert";
import { useParams } from "react-router-dom";

export const useConvertByTypes = () => {
    const { type_code } = useParams<{ type_code: string }>();
    const { convertOverview, isLoading, error } = useConvertOverview();
    const { converts } = useConverts();

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
