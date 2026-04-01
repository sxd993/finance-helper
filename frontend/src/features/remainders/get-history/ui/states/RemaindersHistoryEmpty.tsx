import image from "@/assets/empty-fallback-images/empty-expense-image.png";

export const RemaindersHistoryEmpty = () => {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      <img
        src={image}
        alt="empty-remainders-history"
        className="h-32 w-56 object-contain"
      />
      <h1 className="mt-5 text-xl font-semibold text-slate-900">
        История пока пуста
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        После первого перераспределения здесь появятся переводы остатков с датой, суммой и направлением.
      </p>
    </div>
  );
};
