import type { CreateConvertPayload } from "../types";
import type { ConvertRequestError } from "../types";

export const formatConvertErrorMessage = (
  draft: CreateConvertPayload,
  error: ConvertRequestError,
) => {
  const name = draft.name ? `«${draft.name}»` : "";
  const prefix = name ? `Конверт ${name}:` : "Конверт:";

  return `${prefix} ${error.message}`.trim();
};

