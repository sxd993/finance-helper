export const MiniCircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = (percent: number) => {
        if (percent > 85) return '#10b981';
        if (percent > 60) return '#3b82f6';
        if (percent > 20) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg className="transform -rotate-90" width="64" height="64">
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke="#e2e8f0"
                    strokeWidth="6"
                    fill="none"
                />
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke={getColor(percentage)}
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                />
            </svg>
            <div className="absolute">
                <span className="text-xs font-bold" style={{ color: getColor(percentage) }}>
                    {percentage}%
                </span>
            </div>
        </div>
    );
};
