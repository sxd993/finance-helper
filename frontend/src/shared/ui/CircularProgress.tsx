import React from "react";

interface CircularProgressProps {
  value?: number;
  max?: number;
  percentage?: number;
  size?: number;
  strokeWidth?: number;
  showText?: boolean;       // показывать ли проценты внутри круга
  showStatusText?: boolean; // показывать ли подпись ("Бюджет в порядке")
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  percentage,
  size = 100,
  strokeWidth = 10,
  showText = true,
  showStatusText = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const pctValue = Math.min(
    percentage !== undefined ? percentage : ((value ?? 0) / (max ?? 1)) * 100,
    100
  );

  const offset = circumference - (pctValue / 100) * circumference;

  // цвет и подпись
  let color = "#ef4444"; // красный
  let status = "Бюджет почти исчерпан";

  if (pctValue >= 60) {
    color = "#22c55e"; // зеленый
    status = "Бюджет в порядке";
  } else if (pctValue >= 20) {
    color = "#eab308"; // желтый
    status = "Бюджет на исходе";
  } else if (pctValue === 0) {
    color = "#9ca3af"; // серый
    status = "Бюджет исчерпан";
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="lightgray"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        {showText && (
          <span className="absolute text-sm font-semibold">
            {Math.round(pctValue)}%
          </span>
        )}
      </div>
      {showStatusText && (
        <p className="mt-2 text-sm font-medium" style={{ color }}>
          {status}
        </p>
      )}
    </div>
  );
};
