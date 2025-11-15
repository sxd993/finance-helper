import type { DistributionFieldKey } from "../model/types";

export interface DistributionFieldConfig {
  key: DistributionFieldKey;
  label: string;
  accent: string;
  description: string;
}

export const DISTRIBUTION_FIELDS: DistributionFieldConfig[] = [
  {
    key: "percentSaving",
    label: "Накопления",
    accent: "bg-emerald-500",
    description: "Откладывайте на крупные цели и подушку безопасности",
  },
  {
    key: "percentImportant",
    label: "Повседневные расходы",
    accent: "bg-sky-500",
    description: "Обязательные счета, продукты и транспорт",
  },
  {
    key: "percentInvestment",
    label: "Инвестиции",
    accent: "bg-amber-500",
    description: "Долгосрочный рост капитала",
  },
  {
    key: "percentWishes",
    label: "Траты для удовольствия",
    accent: "bg-pink-500",
    description: "Хобби, путешествия и подарки",
  },
];
