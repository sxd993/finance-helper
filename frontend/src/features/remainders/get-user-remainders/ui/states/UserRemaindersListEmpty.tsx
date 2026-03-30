export const UserRemaindersListEmpty = () => {
  return (
    <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-2 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
        0
      </div>
      <h1 className="text-xl font-semibold text-slate-900">Остатков пока нет</h1>
      <p className="text-sm text-slate-500">
        После завершения финансового цикла здесь появятся сохранённые остатки.
      </p>
    </div>
  );
};
