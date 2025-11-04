import { useNavigate } from "react-router-dom"
import { useConverts, useConvertTypes, ConvertSection, ConvertCard } from "@entities/convert"
import { PlusIcon, Wallet } from "lucide-react";
import { SectionTitle } from "@/shared/ui/SectionTItle";
import { Button } from "@/shared/ui/Button";
import { EmptyConverts } from "@/shared/ui/states";

export const ConvertsList = () => {
    const navigate = useNavigate()
    const { converts } = useConverts();
    const { convert_types } = useConvertTypes();

    if (!converts?.length) {
        return <EmptyConverts />
    }

    return (
        <div className="flex flex-col space-y-5">
            {/* Заголовок секции */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-2">
                <SectionTitle
                    title="Ваши конверты"
                    subtitle="Управляйте своими финансовыми целями"
                    icon={<Wallet className="w-6 h-6 text-primary" />}
                />
                <div className="w-full sm:w-auto">
                    <Button
                        title="Добавить конверт"
                        onClick={() => { navigate('/converts/add-converts') }}
                        size='md'
                        bg="primary"
                        leftIcon={<PlusIcon/>}
                        className="w-full md:w-auto justify-center items-center flex"
                    />
                </div>
            </div>
            {/* Секции с конвертами по типам */}
            <div className="flex flex-col gap-5 ">
                {convert_types.map((type) => {
                    const typedConverts = converts.filter(
                        (c) => c.type_code === type.code
                    );
                    if (typedConverts.length === 0) return null;

                    return (
                        <ConvertSection
                            key={type.code}
                            section_title={type.title}
                            section_code={type.code}
                            section_limit={type.limit}
                            section_current_ammount={type.current_type_amount}
                        >
                            {typedConverts.map((convert) => (
                                <ConvertCard
                                    key={convert.id}
                                    convert={convert}
                                />
                            ))}
                        </ConvertSection>
                    )
                })}
            </div>
        </div>
    )
}
