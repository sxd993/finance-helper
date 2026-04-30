import { getConvertTypePalette } from "@/entities/convert";
import type { ConvertTab } from "@/entities/convert/model/types";
import type { DistributionFieldKey } from "../model/types";

export interface DistributionFieldConfig {
  key: DistributionFieldKey;
  label: string;
  typeCode: ConvertTab;
  description: string;
}

export const DISTRIBUTION_FIELDS: DistributionFieldConfig[] = [
  {
    key: "percentSaving",
    label: "Накопления",
    typeCode: "saving",
    description: "Откладывайте на крупные цели и подушку безопасности",
  },
  {
    key: "percentImportant",
    label: "Повседневные расходы",
    typeCode: "important",
    description: "Обязательные счета, продукты и транспорт",
  },
  {
    key: "percentInvestment",
    label: "Инвестиции",
    typeCode: "investment",
    description: "Долгосрочный рост капитала",
  },
  {
    key: "percentWishes",
    label: "Траты для удовольствия",
    typeCode: "wishes",
    description: "Хобби, путешествия и подарки",
  },
];

export const getDistributionFieldPalette = (typeCode: ConvertTab) =>
  getConvertTypePalette(typeCode);
