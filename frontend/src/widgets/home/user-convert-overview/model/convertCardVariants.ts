import type { LucideIcon } from "lucide-react";
import { HandCoins, Heart, Star, Target } from "lucide-react";

interface CardVariant {
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
    progressColor: string;
    Icon: LucideIcon;
}

export const convertCardVariants: Record<string, CardVariant> = {
    important: {
        iconBg: "bg-amber-100",
        iconColor: "text-orange-600",
        badgeBg: "bg-amber-50",
        badgeText: "text-orange-700",
        progressColor: "bg-orange-600",
        Icon: Heart,
    },
    wishes: {
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
        badgeBg: "bg-rose-50",
        badgeText: "text-rose-700",
        progressColor: "bg-rose-500",
        Icon: Star,
    },
    saving: {
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-700",
        progressColor: "bg-emerald-500",
        Icon: Target,
    },
    investment: {
        iconBg: "bg-sky-100",
        iconColor: "text-sky-600",
        badgeBg: "bg-sky-50",
        badgeText: "text-sky-700",
        progressColor: "bg-sky-500",
        Icon: HandCoins,
    },
};

export const getCardVariant = (code: string) =>
    convertCardVariants[code] ?? convertCardVariants.important;
