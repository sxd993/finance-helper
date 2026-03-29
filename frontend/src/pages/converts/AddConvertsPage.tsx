import { AddConvertsForm, } from "@/features/converts/add-convert"
import { useScrollToTop } from "@/shared/hooks/useScrollToTop"
import { PageFormHeader } from "@/shared/ui/PageFormHeader";
import { Wallet } from "lucide-react";

export const AddConvertsPage = () => {
    useScrollToTop();

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pt-5 pb-20">
            <PageFormHeader
                title="Добавить конверт"
                icon={<Wallet className="h-6 w-6" />}
            />
            <div className="w-full max-w-2xl">
                <AddConvertsForm />
            </div>
        </div>
    )
}
