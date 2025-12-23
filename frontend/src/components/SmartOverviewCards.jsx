import { CheckSquare, Clock, AlertCircle, Users, TrendingUp, Target } from 'lucide-react';
import ProgressRing from './ProgressRing';

const SmartOverviewCards = ({ tasks, onFilterChange }) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;

    // Calculate overdue tasks (mock - would need actual dates)
    const overdueTasks = Math.floor(totalTasks * 0.15); // 15% mock overdue

    // Calculate completion percentage
    const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const cards = [
        {
            title: 'Total Tasks',
            value: totalTasks,
            icon: CheckSquare,
            color: 'from-blue-500 to-blue-600',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            showProgress: true,
            progress: completionPercentage,
            progressColor: 'blue',
            subtitle: `${completedTasks} completed`,
            onClick: () => onFilterChange('all'),
        },
        {
            title: 'Pending Tasks',
            value: pendingTasks,
            icon: Clock,
            color: 'from-orange-500 to-orange-600',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            showProgress: false,
            subtitle: `${inProgressTasks} in progress`,
            onClick: () => onFilterChange('pending'),
        },
        {
            title: 'Overdue Tasks',
            value: overdueTasks,
            icon: AlertCircle,
            color: 'from-red-500 to-red-600',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            showProgress: false,
            subtitle: 'Needs attention',
            onClick: () => onFilterChange('overdue'),
        },
        {
            title: 'Productivity',
            value: `${Math.round(completionPercentage)}%`,
            icon: TrendingUp,
            color: 'from-green-500 to-green-600',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            showProgress: true,
            progress: completionPercentage,
            progressColor: 'green',
            subtitle: 'This week',
            onClick: null,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.title}
                        onClick={card.onClick}
                        className={`card group ${card.onClick ? 'cursor-pointer hover:scale-105' : ''
                            } transition-all duration-300`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`${card.iconBg} p-3 rounded-lg`}>
                                <Icon className={`w-6 h-6 ${card.iconColor}`} />
                            </div>
                            {card.showProgress && (
                                <ProgressRing
                                    progress={card.progress}
                                    size={60}
                                    strokeWidth={6}
                                    color={card.progressColor}
                                />
                            )}
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                            <p className="text-3xl font-bold text-gray-800 mb-2">{card.value}</p>
                            <p className="text-xs text-gray-500">{card.subtitle}</p>
                        </div>

                        {card.onClick && (
                            <div className="mt-3 pt-3 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-xs text-purple-600 font-medium">Click to filter →</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SmartOverviewCards;
