import type { OperationFilter } from "@/entities/operation";

interface HistoryFiltersProps {
  value: OperationFilter;
  onChange: (value: OperationFilter) => void;
}

const options: { value: OperationFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "expense", label: "Списания" },
  { value: "replenishment", label: "Зачисления" },
];

export const HistoryFilters = ({ value, onChange }: HistoryFiltersProps) => (
  <div className="grid grid-cols-3 gap-1 rounded-2xl bg-white/80 p-1 ring-1 ring-slate-200">
    {options.map((option) => {
      const active = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);
