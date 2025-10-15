import { useConvertByTypes } from "../model/useConvertByTypes";
import { ConvertByTypeCard } from "./ConvertByTypeCard";

export const ConvertsByTypeList = () => {
    const { convert_group } = useConvertByTypes();
    return (
        <>
            {convert_group?.map(convert => (
                <div key={convert.id}>
                    <ConvertByTypeCard convert={convert} />
                </div>
            ))}
        </>
    )
}