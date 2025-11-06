import type { CreateConvertPayload } from "../types/addConvertPayload.type";
import type { CreateConvertResponse } from "../types/addConvertResponse.type";
import type { ConvertRequestError } from "../types/convertRequestError.type";
import { parseConvertRequestError } from "../../../converts/add-convert/model/lib/parseConvertRequestError";

interface DraftSuccess {
  index: number;
  draft: CreateConvertPayload;
  response: CreateConvertResponse;
}

interface DraftFailure {
  index: number;
  draft: CreateConvertPayload;
  error: ConvertRequestError;
}

export interface CreateConvertDraftsResult {
  successes: DraftSuccess[];
  failures: DraftFailure[];
}

type CreateConvertHandler = (payload: CreateConvertPayload) => Promise<CreateConvertResponse>;

export const createConvertDrafts = async (
  drafts: CreateConvertPayload[],
  createConvert: CreateConvertHandler,
): Promise<CreateConvertDraftsResult> => {
  const result: CreateConvertDraftsResult = {
    successes: [],
    failures: [],
  };

  for (const [index, draft] of drafts.entries()) {
    try {
      const response = await createConvert(draft);
      result.successes.push({ index, draft, response });
    } catch (error) {
      result.failures.push({
        index,
        draft,
        error: parseConvertRequestError(error),
      });
    }
  }

  return result;
};

