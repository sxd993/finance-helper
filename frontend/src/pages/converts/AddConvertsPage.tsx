import { AddConvertsForm } from "@/features/add-converts"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/providers"
import { ConvertDraftsEmpty } from "@/features/add-converts/ui/ConvertDraftsEmpty"
import { ConvertDraftsList } from "@/features/add-converts/ui/ConvertDraftsList"
import { useScrollToTop } from "@/shared/hooks/useScrollToTop"

export const AddConvertsPage = () => {
    useScrollToTop();
    const drafts = useSelector((state: RootState) => state.create_converts_drafts)
    const hasDrafts = drafts.length > 0

    return (
        <div className="flex flex-col gap-10 max-w-3xl mx-auto pt-5 pb-20">
            <AddConvertsForm />
            {hasDrafts ? <ConvertDraftsList /> : <ConvertDraftsEmpty />}
        </div>
    )
}
