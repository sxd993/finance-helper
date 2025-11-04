export const MiniCircularProgress = ({ percentage }: { percentage: number }) => {
  const size = 64;
  const stroke = 6;
  const center = size / 2;
  const radius = center - stroke; // prevent clipping
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percentage ?? 0));
  const dash = circumference;
  const offset = circumference - (clamped / 100) * circumference;

  const display = clamped.toLocaleString('ru-RU', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  const gradientId = clamped >= 70 ? 'mini-green' : clamped >= 35 ? 'mini-amber' : 'mini-red';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="-rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Прогресс ${display}%`}
      >
        <defs>
          <linearGradient id="mini-red" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="mini-amber" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="mini-green" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={dash}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-slate-700">
          {display}%
        </span>
      </div>
    </div>
  );
};
