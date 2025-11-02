import React from "react";

interface Props {
  value: number; // 0..100
  className?: string;
  barClassName?: string;
}

export const LinearProgress: React.FC<Props> = ({ value, className = "", barClassName = "" }) => {
  return (
    <div className={`h-1.5 bg-slate-100 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full bg-emerald-500 rounded-full transition-[width] duration-500 ease-in-out ${barClassName}`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
};

