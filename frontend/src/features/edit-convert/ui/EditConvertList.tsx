import { useConvertGroups } from "../model/useConvertGroups"
import { EditConvertModal } from "./EditConverModal";
import { EditConvertCard } from "./EditConvertCard";

export const EditConvertList = () => {
    const { convert_group } = useConvertGroups();
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