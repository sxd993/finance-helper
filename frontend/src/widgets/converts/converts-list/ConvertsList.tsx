import { useNavigate } from "react-router-dom"
import { ConvertSection, ConvertCard } from "@entities/convert"
import { PlusIcon, Mail } from "lucide-react";
import { SectionTitle } from "@/shared/ui/SectionTItle";
import { Button } from "@/shared/ui/Button";
import { EmptyConverts } from "@/shared/ui/states";
import { useConvertTypes } from "@/features/converts/get-convert-types";
import { useUserConverts } from "@/features/converts/get-user-converts/models/useUserConverts";

export const ConvertsList = () => {
    const navigate = useNavigate()
    const { converts } = useUserConverts();
    const { convert_types } = useConvertTypes();

    if (!converts?.length) {
        return <EmptyConverts />
    }

    return (
        <div className="flex flex-col space-y-5">
            {/* Заголовок секции */}
            <div className="flex justify-between items-center gap-4 p-2">
                <SectionTitle
                    title="Ваши конверты"
                    subtitle="Управляйте своими финансовыми целями"
                    icon={<Mail className="w-6 h-6 text-primary" />}
                />
                <Button
                    onClick={() => { navigate('/converts/add-converts') }}
                    size='sm'
                    bg="primary"
                    leftIcon={<PlusIcon />}
                    className="justify-center items-center flex"
                />
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
