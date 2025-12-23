const TaskStatusChart = ({ tasks }) => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const done = tasks.filter((t) => t.status === 'done').length;

    const todoPercent = total > 0 ? (todo / total) * 100 : 0;
    const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0;
    const donePercent = total > 0 ? (done / total) * 100 : 0;

    const data = [
        { label: 'To Do', value: todo, percent: todoPercent, color: 'bg-gray-400' },
        { label: 'In Progress', value: inProgress, percent: inProgressPercent, color: 'bg-blue-500' },
        { label: 'Done', value: done, percent: donePercent, color: 'bg-green-500' },
    ];

    return (
        <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Task Status Distribution</h3>

            {/* Stacked bar chart */}
            <div className="mb-6">
                <div className="flex h-8 rounded-lg overflow-hidden">
                    {data.map((item, index) => (
                        item.percent > 0 && (
                            <div
                                key={item.label}
                                className={`${item.color} flex items-center justify-center text-white text-xs font-semibold transition-all duration-300`}
                                style={{ width: `${item.percent}%` }}
                            >
                                {item.percent >= 15 && `${Math.round(item.percent)}%`}
                            </div>
                        )
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-4">
                {data.map((item) => (
                    <div key={item.label} className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                            <span className="text-xs text-gray-600">{item.label}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                        <p className="text-xs text-gray-500">{Math.round(item.percent)}%</p>
                    </div>
                ))}
            </div>

            {total === 0 && (
                <div className="text-center py-6 text-gray-500 text-sm">
                    No tasks to display
                </div>
            )}
        </div>
    );
};

export default TaskStatusChart;
