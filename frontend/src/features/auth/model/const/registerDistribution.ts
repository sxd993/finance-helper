import type { ConvertTab } from "@/entities/convert";

export type RegisterDistributionFieldName =
  | "percentImportant"
  | "percentWishes"
  | "percentSaving"
  | "percentInvestment";

export interface RegisterDistributionField {
  name: RegisterDistributionFieldName;
  label: string;
  typeCode: ConvertTab;
  description: string;
}

export const REGISTER_DISTRIBUTION_DEFAULTS: Record<RegisterDistributionFieldName, number> = {
  percentImportant: 50,
  percentWishes: 30,
  percentSaving: 10,
  percentInvestment: 10,
};

export const REGISTER_DISTRIBUTION_FIELDS: RegisterDistributionField[] = [
  {
    name: "percentImportant",
    label: "Необходимые расходы",
    typeCode: "important",
    description: "Еда, жильё, транспорт, счета и другие обязательные траты",
  },
  {
    name: "percentWishes",
    label: "Желания",
    typeCode: "wishes",
    description: "Кафе, развлечения, подарки, хобби и покупки для удовольствия",
  },
  {
    name: "percentSaving",
    label: "Накопления",
    typeCode: "saving",
    description: "Подушка безопасности и крупные цели",
  },
  {
    name: "percentInvestment",
    label: "Инвестиции",
    typeCode: "investment",
    description: "Долгосрочный рост капитала и активы",
  },
];

export const sumRegisterDistribution = (
  values: Partial<Record<RegisterDistributionFieldName, number | null | undefined>>,
) =>
  REGISTER_DISTRIBUTION_FIELDS.reduce(
    (sum, field) => sum + Number(values[field.name] || 0),
    0,
  );

export const isValidRegisterDistribution = (total: number) =>
  Math.abs(total - 100) <= 0.01;
