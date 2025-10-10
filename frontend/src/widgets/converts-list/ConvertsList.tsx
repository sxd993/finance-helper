import { useConverts, useConvertTypes, ConvertSection } from "@entities/convert"
import { ConvertCard } from "../../entities/convert/ui/ConvertCard";

export const ConvertsList = () => {

    const { converts } = useConverts();
    const { convert_types } = useConvertTypes();

    return (
        <div className="flex flex-col gap-4">
            {convert_types.map((type) => {
                const typedConverts = converts.filter(c => c.type_id?.id === type.id)
                return (
                    <ConvertSection key={type.id} section_title={type.title}>
                        <div className="grid grid-cols-1 gap-2">
                            {typedConverts.map((convert) => (
                                <ConvertCard key={convert.id} convert={convert} />
                            ))}
                        </div>
                    </ConvertSection>
                )
            })}
        </div>
    )
}
