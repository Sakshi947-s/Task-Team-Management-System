import { CheckCircle, Circle, Clock } from 'lucide-react';

const MyTasksWidget = ({ tasks, user }) => {
    // Filter tasks for current user
    const myTasks = tasks.filter(
        (task) => task.assignedTo?._id === user?._id || task.status !== 'done'
    ).slice(0, 5); // Show top 5

    const getPriorityColor = (status) => {
        const colors = {
            todo: 'text-gray-400',
            'in-progress': 'text-blue-500',
            done: 'text-green-500',
        };
        return colors[status] || 'text-gray-400';
    };

    const getStatusIcon = (status) => {
        if (status === 'done') return CheckCircle;
        if (status === 'in-progress') return Clock;
        return Circle;
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">My Tasks</h3>
                <span className="text-sm text-gray-500">{myTasks.length} tasks</span>
            </div>

            <div className="space-y-3">
                {myTasks.length > 0 ? (
                    myTasks.map((task) => {
                        const StatusIcon = getStatusIcon(task.status);
                        return (
                            <div
                                key={task._id}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                            >
                                <StatusIcon className={`w-5 h-5 ${getPriorityColor(task.status)}`} />

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-800 text-sm truncate group-hover:text-purple-600 transition-colors">
                                        {task.title}
                                    </h4>
                                    <p className="text-xs text-gray-500">{task.team?.name || 'No team'}</p>
                                </div>

                                <select
                                    value={task.status}
                                    onChange={(e) => {
                                        // Status change would be handled by parent
                                        console.log('Status change:', task._id, e.target.value);
                                    }}
                                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No tasks assigned</p>
                    </div>
                )}
            </div>

            {myTasks.length > 0 && (
                <button className="w-full mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium py-2 rounded-lg hover:bg-purple-50 transition-colors">
                    View All My Tasks →
                </button>
            )}
        </div>
    );
};

export default MyTasksWidget;
