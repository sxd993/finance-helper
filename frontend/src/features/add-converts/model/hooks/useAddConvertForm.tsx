import type { RootState } from "@/app/providers";
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux";
import { useAddConvert } from "./useAddConvert";
import { addConvertInStore } from "../store/createConvertDraftsSlice";
import type { CreateConvertPayload } from "../types/addConvertPayload.type";


export const useAddConvertForm = () => {
  const form = useForm<CreateConvertPayload>();
  const dispatch = useDispatch();
  const { onCreateConverts, isSuccess, isPending, error } = useAddConvert();
  const drafts = useSelector((state: RootState) => state.converts_drafts)

  const onSubmit = form.handleSubmit((data) => {
    dispatch(addConvertInStore(data))
  })

  const onCreate = async () => {
    for (const draft of drafts) {
      await onCreateConverts(draft)
    }
  }

  return {
    ...form,
    onSubmit,
    onCreate,
    isPending,
    isSuccess,
    error,
  }

}
