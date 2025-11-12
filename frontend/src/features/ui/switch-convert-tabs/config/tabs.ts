import { type ConvertTab } from "../store/ConvertTabs.slice";

export const convertTabsConfig: { value: ConvertTab; label: string }[] = [
  { value: "important", label: "Необходимое" },
  { value: "wishes", label: "Желания" },
  { value: "saving", label: "Накопления" },
  { value: "investment", label: "Инвестиции" },
];
