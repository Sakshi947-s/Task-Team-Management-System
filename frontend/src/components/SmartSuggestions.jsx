import { Lightbulb, TrendingUp } from 'lucide-react';

const SmartSuggestions = ({ tasks }) => {
    // Calculate suggestions based on task data
    const overdueTasks = tasks.filter((t) => t.status !== 'done').slice(0, 2);
    const highPriorityTasks = tasks.filter((t) => t.status === 'todo').slice(0, 2);

    const suggestions = [
        {
            id: 1,
            type: 'overdue',
            icon: '⚡',
            title: 'Urgent: Overdue tasks need attention',
            tasks: overdueTasks.length > 0 ? overdueTasks : null,
            color: 'bg-red-50 border-red-200 text-red-700',
        },
        {
            id: 2,
            type: 'priority',
            icon: '🎯',
            title: 'Focus on these high-priority tasks',
            tasks: highPriorityTasks.length > 0 ? highPriorityTasks : null,
            color: 'bg-blue-50 border-blue-200 text-blue-700',
        },
        {
            id: 3,
            type: 'insight',
            icon: '💡',
            title: 'You complete tasks faster in the morning',
            insight: true,
            color: 'bg-purple-50 border-purple-200 text-purple-700',
        },
        {
            id: 4,
            type: 'tip',
            icon: '✨',
            title: 'Consider breaking large tasks into smaller ones',
            insight: true,
            color: 'bg-green-50 border-green-200 text-green-700',
        },
    ];

    return (
        <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span>Smart Suggestions</span>
            </h3>

            <div className="space-y-3">
                {suggestions
                    .filter((s) => s.insight || (s.tasks && s.tasks.length > 0))
                    .map((suggestion) => (
                        <div
                            key={suggestion.id}
                            className={`p-3 rounded-lg border-2 ${suggestion.color} transition-all hover:shadow-md`}
                        >
                            <div className="flex items-start space-x-2">
                                <span className="text-2xl">{suggestion.icon}</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm mb-1">{suggestion.title}</p>
                                    {suggestion.tasks && (
                                        <ul className="text-xs space-y-1 mt-2">
                                            {suggestion.tasks.map((task) => (
                                                <li key={task._id} className="flex items-center space-x-1">
                                                    <span>→</span>
                                                    <span className="truncate">{task.title}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
                <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <div>
                        <p className="font-semibold text-sm">Productivity Tip</p>
                        <p className="text-xs mt-1">
                            You're 15% more productive when you tackle smaller tasks first!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartSuggestions;
