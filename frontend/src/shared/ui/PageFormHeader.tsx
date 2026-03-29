import type { ReactNode } from "react";

interface PageFormHeaderProps {
  title: string;
  icon: ReactNode;
}

export const PageFormHeader = ({ title, icon }: PageFormHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">{title}</h1>
      </div>
    </div>
  );
};
