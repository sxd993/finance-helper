import { formatPrice } from "../utils/formatPrice";
import { Wallet } from "lucide-react";

interface BalanceCardProps {
    title: string;
    sum: number;
    subtitle?: string;
    icon?: React.ReactNode;
}

export const BalanceCard = ({
    title,
    sum,
    subtitle,
    icon = <Wallet size={24} className="text-slate-600" />,
}: BalanceCardProps) => {
    const formattedPrice = formatPrice(sum);

    return (
        <div
            className="
                flex flex-col justify-between gap-3
                rounded-2xl border border-slate-200
                bg-white p-4
                text-slate-800
                hover:bg-slate-50
                transition-colors duration-200
            "
        >
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    {icon}
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-medium">{title}</p>
                    {subtitle && (
                        <p className="text-xs text-slate-500">{subtitle}</p>
                    )}
                </div>
            </div>
            <p className="text-2xl font-semibold">{formattedPrice}</p>
        </div>
    );
};
