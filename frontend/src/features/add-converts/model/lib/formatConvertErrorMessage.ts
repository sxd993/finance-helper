import type { CreateConvertPayload } from "../types/addConvertPayload.type";
import type { ConvertRequestError } from "../types/convertRequestError.type";

export const formatConvertErrorMessage = (
  draft: CreateConvertPayload,
  error: ConvertRequestError,
) => {
  const name = draft.name ? `«${draft.name}»` : "";
  const prefix = name ? `Конверт ${name}:` : "Конверт:";

  return `${prefix} ${error.message}`.trim();
};

