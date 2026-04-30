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
    key: "percentImportant",
    label: "Необходимое",
    typeCode: "important",
    description: "Обязательные счета, продукты и транспорт",
  },
  {
    key: "percentWishes",
    label: "Желания",
    typeCode: "wishes",
    description: "Кафе, развлечения, подарки и покупки для удовольствия",
  },
  {
    key: "percentSaving",
    label: "Накопления",
    typeCode: "saving",
    description: "Подушка безопасности и крупные цели",
  },
  {
    key: "percentInvestment",
    label: "Инвестиции",
    typeCode: "investment",
    description: "Долгосрочный рост капитала и активы",
  },
];

export const getDistributionFieldPalette = (typeCode: ConvertTab) =>
  getConvertTypePalette(typeCode);
