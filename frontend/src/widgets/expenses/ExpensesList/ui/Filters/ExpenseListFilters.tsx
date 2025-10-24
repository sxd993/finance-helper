export const ExpenseListFilters = () => {
    return (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mt-3 mb-2">
            {['Все', 'Категории', 'Неделя', 'Месяц'].map((item, i) => (
                <button
                    key={i}
                    className={`px-4 py-1.5 rounded-full whitespace-nowrap ${i === 0
                        ? 'bg-primary/10 text-primary-dark '
                        : 'bg-gray-50 hover:bg-gray-100 text-black'
                        } transition`}
                >
                    {item}
                </button>
            ))}
        </div>
    )
}