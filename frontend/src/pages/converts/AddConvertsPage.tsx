import { AddConvertsForm, } from "@/features/converts/add-convert"
import { useScrollToTop } from "@/shared/hooks/useScrollToTop"

export const AddConvertsPage = () => {
    useScrollToTop();

    return (
        <div className="flex flex-col gap-10 max-w-3xl mx-auto pt-5 pb-20 p-4">
            <AddConvertsForm />
        </div>
    )
}
