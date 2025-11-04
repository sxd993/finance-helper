import { useNavigate } from "react-router-dom"
import { useConverts, useConvertTypes, ConvertSection, ConvertCard } from "@entities/convert"
import { ConvertsListEmpty } from "./ConvertsListEmpy";
import { Wallet } from "lucide-react";
import { SectionTitle } from "@/shared/ui/SectionTItle";
import { Button } from "@/shared/ui/Button";

export const ConvertsList = () => {
    const navigate = useNavigate()
    const { converts } = useConverts();
    const { convert_types } = useConvertTypes();

    if (!converts?.length) {
        return <ConvertsListEmpty />
    }

    return (
        <div className="flex flex-col gap-10">
            {/* Заголовок секции */}
            <div className="flex xs:justify-between justify-center xs:flex-row flex-col gap-5 items-center bg-white shadow-md p-4 rounded-xl">
                <SectionTitle
                    title="Ваши конверты"
                    subtitle="Управляйте своими финансовыми целями"
                    icon={<Wallet className="w-6 h-6 text-primary" />}
                />
                <div className="flex xs:justify-between justify-center">
                    <Button
                        title="Добавить конверт"
                        onClick={
                            () => {
                                navigate('/converts/add-converts')
                            }
                        }
                        size='md'
                        bg="primary"
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
