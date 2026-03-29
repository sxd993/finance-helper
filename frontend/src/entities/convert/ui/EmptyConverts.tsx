import image from "../../../assets/empty-fallback-images/empty-converts-image.png";

export const EmptyConverts = () => {

    return (
        <div className="mx-auto my-8 flex max-w-md flex-col items-center text-center">
            <img
                src={image}
                alt="empty-converts"
                className="h-32 w-56 object-contain"
            />
            <h1 className="mt-5 text-xl font-semibold text-slate-900">У вас пока нет конвертов</h1>
        </div>
    );
};
