import { EditConvertCard } from "@/features/edit-convert/ui/EditConvertCard";
import { useConvertByTypes } from "../model/useConvertByTypes";

export const ConvertsByTypeList = () => {
    const { convert_group } = useConvertByTypes();
    return (
        <>
            {convert_group?.map(convert => (
                <div key={convert.id}>
                    <EditConvertCard convert={convert} />
                </div>
            ))}
        </>
    )
}