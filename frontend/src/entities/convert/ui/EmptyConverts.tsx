import { Button } from "@/shared/ui/Button";
import { useNavigate } from "react-router-dom";
import image from "../../../assets/empty-fallback-images/empty-converts-image.png";

export const EmptyConverts = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center w-fit mx-auto my-6">
            <img
                src={image}
                alt="empty-expense-image"
                className="w-40 h-25 object-cover"
            />
            <div className="space-y-1.5 flex flex-col items-center"> 
                <h1 className="text-lg font-semibold text-gray-900">
                    У вас нет конвертов
                </h1>
                <p className="text-gray-500 text-sm text-center">
                    Вы пока не создали ни одной транзакции.
                </p>
                <Button
                    title="Перейти к созданию"
                    size="sm"
                    onClick={() => navigate("/converts/add-converts")}
                    bg="primary"
                />
            </div>
        </div>
    );
};
