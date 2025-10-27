import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import { createConvertDrafts } from "../services/createConvertDrafts";
import type { CreateConvertPayload } from "../types/addConvertPayload.type";
import { formatConvertErrorMessage } from "../lib/formatConvertErrorMessage";
import { useAddConvert } from "./useAddConvert";
import { removeDraftsByIndexes } from "../store/createConvertDraftsSlice";

interface CreateDraftsOptions {
  drafts: CreateConvertPayload[];
}

export const useCreateConvertDrafts = () => {
  const dispatch = useDispatch();
  const { onCreateConverts, invalidateQueries } = useAddConvert();
  const [isCreating, setIsCreating] = useState(false);
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);

  const handleCreateDrafts = useCallback(
    async ({ drafts }: CreateDraftsOptions) => {
      if (!drafts.length) {
        return;
      }

      setIsCreating(true);
      setLastErrorMessage(null);

      try {
        const result = await createConvertDrafts(drafts, onCreateConverts);

        if (result.successes.length > 0) {
          const successIndexes = result.successes.map((item) => item.index);
          dispatch(removeDraftsByIndexes(successIndexes));
          await invalidateQueries();

          const successMessage = result.failures.length
            ? `Создано ${result.successes.length} из ${drafts.length} конвертов`
            : `Создано конвертов: ${result.successes.length}`;

          toast.success(successMessage);
        }

        if (result.failures.length > 0) {
          result.failures.forEach(({ draft, error }) => {
            const message = formatConvertErrorMessage(draft, error);
            toast.error(message);
          });

          const [firstFailure] = result.failures;
          setLastErrorMessage(formatConvertErrorMessage(firstFailure.draft, firstFailure.error));
        }
      } finally {
        setIsCreating(false);
      }
    },
    [dispatch, invalidateQueries, onCreateConverts],
  );

  return {
    createDrafts: handleCreateDrafts,
    isCreating,
    lastErrorMessage,
  };
};

