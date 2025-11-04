import type { ConvertTypeLimitSummary } from "@/entities/convert";
import { formatPrice } from "@/shared/utils/formatPrice";

export interface ConvertTypeOverviewMetric {
  label: string;
  value: string;
}

export interface ConvertTypeOverviewItem {
  code: string;
  title: string;
  metrics: ConvertTypeOverviewMetric[];
  note?: string;
}

const formatCurrency = (value: number | null | undefined): string => {
  if (value == null) {
    return "—";
  }

  return formatPrice(value) ?? `${value.toLocaleString("ru-RU")} ₽`;
};

const buildStatusNote = (limit: ConvertTypeLimitSummary): string | undefined => {
  const noteParts: string[] = [];

  if (!limit.has_limit) {
    noteParts.push("Лимит не задан");
  }

  if (!limit.can_spend) {
    noteParts.push("Траты недоступны");
  }

  return noteParts.length > 0 ? noteParts.join(" · ") : undefined;
};

const buildImportantOrWishes = (limit: ConvertTypeLimitSummary): ConvertTypeOverviewItem => {
  const metrics: ConvertTypeOverviewMetric[] = [];

  if (limit.has_limit) {
    metrics.push({
      label: "Свободно",
      value: formatCurrency(limit.available),
    });

    metrics.push({
      label: "Всего",
      value: formatCurrency(limit.limit ?? limit.initial_total),
    });

    if (limit.used != null) {
      metrics.push({
        label: "Распределено",
        value: formatCurrency(limit.used),
      });
    }
  } else {
    metrics.push({
      label: "Свободно",
      value: formatCurrency(limit.current_total),
    });
  }

  return {
    code: limit.code,
    title: limit.title,
    metrics,
    note: buildStatusNote(limit),
  };
};

const buildSaving = (limit: ConvertTypeLimitSummary): ConvertTypeOverviewItem => {
  const currentAmount = limit.current_total ?? 0;
  const targetAmount = limit.limit ?? limit.initial_total ?? null;
  const remainingToGoal =
    targetAmount != null ? Math.max(targetAmount - currentAmount, 0) : null;

  const metrics: ConvertTypeOverviewMetric[] = [
    {
      label: "Сейчас",
      value: formatCurrency(currentAmount),
    },
  ];

  if (remainingToGoal != null) {
    metrics.push({
      label: "До цели",
      value: formatCurrency(remainingToGoal),
    });
  }

  if (targetAmount != null) {
    metrics.push({
      label: "Цель",
      value: formatCurrency(targetAmount),
    });
  }

  return {
    code: limit.code,
    title: limit.title,
    metrics,
    note: buildStatusNote(limit),
  };
};

const buildInvestment = (limit: ConvertTypeLimitSummary): ConvertTypeOverviewItem => {
  const metrics: ConvertTypeOverviewMetric[] = [
    {
      label: "Текущая стоимость",
      value: formatCurrency(limit.current_total),
    },
  ];

  if (limit.initial_total != null) {
    metrics.push({
      label: "Вложено",
      value: formatCurrency(limit.initial_total),
    });
  }

  return {
    code: limit.code,
    title: limit.title,
    metrics,
    note: buildStatusNote(limit),
  };
};

const buildDefaultItem = (limit: ConvertTypeLimitSummary): ConvertTypeOverviewItem => {
  const metrics: ConvertTypeOverviewMetric[] = [];

  if (limit.has_limit) {
    metrics.push({
      label: "Свободно",
      value: formatCurrency(limit.available),
    });

    metrics.push({
      label: "Всего",
      value: formatCurrency(limit.limit),
    });
  }

  if (limit.current_total != null) {
    metrics.push({
      label: "Сейчас",
      value: formatCurrency(limit.current_total),
    });
  }

  return {
    code: limit.code,
    title: limit.title,
    metrics,
    note: buildStatusNote(limit),
  };
};

export const buildConvertTypeOverview = (
  limits?: ConvertTypeLimitSummary[] | null,
): ConvertTypeOverviewItem[] => {
  if (!limits) {
    return [];
  }

  return limits
    .map((limit) => {
      switch (limit.code) {
        case "important":
        case "wishes":
          return buildImportantOrWishes(limit);
        case "saving":
          return buildSaving(limit);
        case "investment":
          return buildInvestment(limit);
        default:
          return buildDefaultItem(limit);
      }
    })
    .filter((item) => item.metrics.length > 0);
};

