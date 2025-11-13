import image from "../../../assets/empty-fallback-images/empty-converts-image.png";

export const EmptyConverts = () => {

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
                    Вы пока не создали ни одного конверта этой категории.
                </p>
            </div>
        </div>
    );
};
