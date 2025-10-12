import { useConverts, useConvertTypes, ConvertSection, ConvertCard } from "@entities/convert"
import { ConvertsListEmpty } from "./ConvertsListEmpy";
import { Wallet } from "lucide-react";
import { SectionTitle } from "@/shared/ui/SectionTItle";

export const ConvertsList = () => {
    const { converts } = useConverts();
    const { convert_types } = useConvertTypes();

    if (!converts) {
        return <ConvertsListEmpty />
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Заголовок секции */}
            <SectionTitle
                title="Ваши конверты"
                subtitle="Управляйте своими финансовыми целями"
                icon={<Wallet className="w-6 h-6 text-primary" />}
            />
            {/* Секции с конвертами по типам */}
            <div className="flex flex-col gap-4">
                {convert_types.map((type) => {
                    const typedConverts = converts.filter(c => c.type_id?.id === type.id);
                    if (typedConverts.length === 0) return null;

                    return (
                        <ConvertSection key={type.id} section_title={type.title} section_code={type.code}>
                            {typedConverts.map((convert) => (
                                <ConvertCard key={convert.id} convert={convert} />
                            ))}
                        </ConvertSection>
                    )
                })}
            </div>
        </div>
    )
}
