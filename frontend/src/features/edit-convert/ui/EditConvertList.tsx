import { useEditConvert } from "../model/useEditConvert"
import { EditConvertCard } from "./EditConvertCard";

export const EditConvertList = () => {
    const { convert_group } = useEditConvert();
    return (
        <>
            {convert_group?.map(convert => (
                <EditConvertCard convert={convert} />
            ))}
        </>
    )
}