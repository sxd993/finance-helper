import type { RootState } from "@/app/providers";
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux";
import { addConvertInStore, clearDrafts } from "../store/createConvertDraftsSlice";
import type { CreateConvertPayload } from "../types/addConvertPayload.type";
import { useCreateConvertDrafts } from "./useCreateConvertDrafts";


export const useAddConvertForm = () => {
  const form = useForm<CreateConvertPayload>();
  const dispatch = useDispatch();
  const drafts = useSelector((state: RootState) => state.create_converts_drafts)
  const { createDrafts, isCreating, lastErrorMessage } = useCreateConvertDrafts();


  const onClearDrafts = () => {
    dispatch(clearDrafts())
  }
  const onSubmit = form.handleSubmit((data) => {
    dispatch(addConvertInStore(data))
  })

  const onCreate = async () => {
    await createDrafts({ drafts })
  }

  return {
    ...form,
    onSubmit,
    onCreate,
    onClearDrafts,
    isPending: isCreating,
    errorMessage: lastErrorMessage,
  }

}
