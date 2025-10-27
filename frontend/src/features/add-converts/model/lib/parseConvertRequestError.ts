import { isAxiosError } from "axios";

import type { ConvertErrorResponse } from "../types/convertErrorResponse.type";
import type { ConvertRequestError } from "../types/convertRequestError.type";

const fallbackError: ConvertRequestError = {
  message: "Не удалось создать конверт",
};

const formatNumber = (value?: number | null) => {
  if (value == null) {
    return undefined;
  }

  return new Intl.NumberFormat("ru-RU").format(value);
};

const buildLimitErrorMessage = (response?: ConvertErrorResponse, baseMessage?: string) => {
  const parts: string[] = [];

  if (baseMessage) {
    parts.push(baseMessage);
  }

  const available = formatNumber(response?.available);
  const required = formatNumber(response?.required);

  if (available) {
    parts.push(`Доступно к распределению: ${available}`);
  }

  if (required) {
    parts.push(`Нужно выделить: ${required}`);
  }

  return parts.join(". ");
};

export const parseConvertRequestError = (error: unknown): ConvertRequestError => {
  if (!isAxiosError(error)) {
    return fallbackError;
  }

  const status = error.response?.status;
  const response = error.response?.data as ConvertErrorResponse | undefined;
  const baseMessage = response?.message || error.message || fallbackError.message;

  if (response?.code === "TYPE_LIMIT_EXCEEDED") {
    return {
      message: buildLimitErrorMessage(response, baseMessage),
      code: response.code,
      status,
      details: {
        limit: response.limit,
        used: response.used,
        required: response.required,
        available: response.available,
      },
    };
  }

  if (response?.code === "DUPLICATE_NAME") {
    return {
      message: baseMessage || "Конверт с таким названием уже существует",
      code: response.code,
      status,
      details: {
        existingId: response.existing_id,
      },
    };
  }

  return {
    message: baseMessage,
    code: response?.code,
    status,
  };
};

