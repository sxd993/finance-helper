import { Button } from "@/shared/ui/Button";
import { useNavigate } from "react-router-dom";

export const ConvertOverviewEmpty = () => {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col gap-y-10">
            <h2 className="text-lg">Общая информация о конвертах</h2>
            <div className="flex flex-col items-center justify-start text-center p-10 shadow-lg rounded-2xl border-1 border-slate-200">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-frown mb-3"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                    <line x1="9" x2="9.01" y1="9" y2="9" />
                    <line x1="15" x2="15.01" y1="9" y2="9" />
                </svg>
                <h2 className="text-lg font-medium mb-5">
                    Вы еще не создали ни одного конверта
                </h2>
                <div className="max-w-full">
                    <Button
                        title="Перейти к созданию?"
                        onClick={() => navigate('/converts/add-converts')}
                        bg="primary"
                    />
                </div>
            </div>
        </div>
    )
}
