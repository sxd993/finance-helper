import { renderConvertIcon } from "@/shared/utils/renderConvertIcon";
import type { ConvertTypeOverviewItem } from "../lib/buildConvertTypeOverview";

interface ConvertTypeOverviewProps {
  items: ConvertTypeOverviewItem[];
}

export const ConvertTypeOverview = ({ items }: ConvertTypeOverviewProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.code}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 shadow-sm">
                {renderConvertIcon(item.code)}
              </div>
              <span className="text-base font-semibold text-slate-900">{item.title}</span>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {item.metrics.map((metric) => (
                <div key={`${item.code}-${metric.label}`} className="flex flex-col">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {metric.label}
                  </dt>
                  <dd className="text-base font-semibold text-slate-900">{metric.value}</dd>
                </div>
              ))}
            </dl>

            {item.note && (
              <p className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                {item.note}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

