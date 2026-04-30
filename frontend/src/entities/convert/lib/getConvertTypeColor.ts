export interface ConvertTypePalette {
  text: string;
  bg: string;
  softBg: string;
  border: string;
}

const CONVERT_TYPE_COLOR_MAP: Record<string, ConvertTypePalette> = {
  important: {
    text: "text-important",
    bg: "bg-important",
    softBg: "bg-important/10",
    border: "border-important/20",
  },
  wishes: {
    text: "text-wishes",
    bg: "bg-wishes",
    softBg: "bg-wishes/10",
    border: "border-wishes/30",
  },
  saving: {
    text: "text-saving",
    bg: "bg-saving",
    softBg: "bg-saving/10",
    border: "border-saving/20",
  },
  investment: {
    text: "text-investment",
    bg: "bg-investment",
    softBg: "bg-investment/10",
    border: "border-investment/20",
  },
};

const DEFAULT_CONVERT_TYPE_COLOR: ConvertTypePalette = {
  text: "text-primary",
  bg: "bg-primary",
  softBg: "bg-primary/10",
  border: "border-primary/20",
};

export const getConvertTypeColor = (typeCode?: string | null) => {
  if (!typeCode) {
    return DEFAULT_CONVERT_TYPE_COLOR;
  }

  return CONVERT_TYPE_COLOR_MAP[typeCode] ?? DEFAULT_CONVERT_TYPE_COLOR;
};

export const getConvertTypePalette = getConvertTypeColor;
