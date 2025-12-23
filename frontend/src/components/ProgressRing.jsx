const ProgressRing = ({ progress, size = 80, strokeWidth = 8, color = 'purple' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    const colors = {
        purple: 'stroke-purple-600',
        blue: 'stroke-blue-600',
        green: 'stroke-green-600',
        orange: 'stroke-orange-600',
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={`${colors[color]} transition-all duration-500 ease-out`}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute text-center">
                <span className="text-2xl font-bold text-gray-800">{Math.round(progress)}%</span>
            </div>
        </div>
    );
};

export default ProgressRing;
