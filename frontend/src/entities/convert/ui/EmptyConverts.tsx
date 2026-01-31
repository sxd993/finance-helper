import image from "../../../assets/empty-fallback-images/empty-converts-image.png";
import { Link } from "react-router-dom";

interface EmptyConvertsProps {
    typeCode?: string
}

export const EmptyConverts = ({ typeCode }: EmptyConvertsProps) => {
    const nextPath = typeCode
        ? `/converts/add-converts?type=${encodeURIComponent(typeCode)}`
        : "/converts/add-converts";

    return (
        <div className="flex flex-col items-center text-center max-w-sm mx-auto my-6">
            <img
                src={image}
                alt="empty-converts"
                className="w-44 h-24 object-contain"
            />
            <p className="text-sm text-slate-500 leading-relaxed mt-2">
                Создайте первый конверт этой категории.
            </p>
            <Link
                to={nextPath}
                className="text-sm font-semibold text-white bg-emerald-600 rounded-lg px-6 py-3 shadow-sm hover:bg-emerald-700 transition mt-4"
            >
                Создать конверт
            </Link>
        </div>
    );
};
