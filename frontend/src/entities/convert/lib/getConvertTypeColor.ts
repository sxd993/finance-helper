const CONVERT_TYPE_COLOR_MAP: Record<string, { text: string; bg: string; softBg: string }> = {
  important: {
    text: "text-orange-500",
    bg: "bg-orange-500",
    softBg: "bg-orange-50",
  },
  wishes: {
    text: "text-yellow-500",
    bg: "bg-yellow-500",
    softBg: "bg-yellow-50",
  },
  saving: {
    text: "text-green-500",
    bg: "bg-green-500",
    softBg: "bg-green-50",
  },
  investment: {
    text: "text-blue-500",
    bg: "bg-blue-500",
    softBg: "bg-blue-50",
  },
};

const DEFAULT_CONVERT_TYPE_COLOR = {
  text: "text-primary",
  bg: "bg-primary",
  softBg: "bg-primary/10",
};

export const getConvertTypeColor = (typeCode?: string | null) => {
  if (!typeCode) {
    return DEFAULT_CONVERT_TYPE_COLOR;
  }

  return CONVERT_TYPE_COLOR_MAP[typeCode] ?? DEFAULT_CONVERT_TYPE_COLOR;
};
