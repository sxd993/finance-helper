import { useConvertByTypes } from "../model/useConvertByTypes";
import { ConvertByTypeCard } from "./ConvertByTypeCard";

export const ConvertsByTypeList = () => {
    const { convert_group, convert_overview_group } = useConvertByTypes();
    const overviewInfo = convert_overview_group?.info ?? null;

    return (
        <>
            {convert_group?.map(convert => (
                <div key={convert.id}>
                    <ConvertByTypeCard
                        convert={convert}
                        overviewInfo={overviewInfo}
                    />
                </div>
            ))}
        </>
    )
}
