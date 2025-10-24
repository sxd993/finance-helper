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
    icon = <Wallet size={28} className="text-white/80" />,
}: BalanceCardProps) => {
    const formattedPrice = formatPrice(sum);

    return (
        <div className="flex flex-col justify-between gap-3 rounded-3xl bg-gradient-to-tl from-primary-dark to-secondary-dark px-4 py-5">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    {icon}
                </div>
                <div className="flex flex-col">
                    <p className="text-sm text-white">{title}</p>
                    {subtitle && <p className="text-xs text-green-200">{subtitle}</p>}
                </div>
            </div>
            <p className="text-3xl  text-white">{formattedPrice}</p>
        </div>
    );
};
