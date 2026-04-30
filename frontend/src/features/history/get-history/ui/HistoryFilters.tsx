import type { OperationFilter } from "@/entities/operation";

interface HistoryFiltersProps {
  value: OperationFilter;
  onChange: (value: OperationFilter) => void;
}

const options: { value: OperationFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "expense", label: "Расходы" },
  { value: "replenishment", label: "Пополнения" },
];

export const HistoryFilters = ({ value, onChange }: HistoryFiltersProps) => (
  <div className="grid grid-cols-3 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
    {options.map((option) => {
      const active = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-xl px-3 py-2 text-sm font-medium transition ${active ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);

