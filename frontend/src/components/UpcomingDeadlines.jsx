import { Calendar, Clock, AlertTriangle } from 'lucide-react';

const UpcomingDeadlines = ({ tasks }) => {
    // Mock deadline data - in real app would use actual task dates
    const deadlines = [
        {
            id: 1,
            title: 'Design Homepage UI',
            dueDate: 'Today',
            priority: 'high',
            daysLeft: 0,
            team: 'Design Team',
        },
        {
            id: 2,
            title: 'API Integration',
            dueDate: 'Tomorrow',
            priority: 'high',
            daysLeft: 1,
            team: 'Backend Team',
        },
        {
            id: 3,
            title: 'Database Schema',
            dueDate: 'In 2 days',
            priority: 'medium',
            daysLeft: 2,
            team: 'Backend Team',
        },
        {
            id: 4,
            title: 'Testing Phase',
            dueDate: 'In 5 days',
            priority: 'low',
            daysLeft: 5,
            team: 'QA Team',
        },
    ];

    const getPriorityColor = (priority) => {
        const colors = {
            high: 'bg-red-100 text-red-700 border-red-300',
            medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
            low: 'bg-green-100 text-green-700 border-green-300',
        };
        return colors[priority];
    };

    return (
        <div className="card h-fit">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span>Upcoming Deadlines</span>
                </h3>
            </div>

            <div className="space-y-3">
                {deadlines.map((deadline) => (
                    <div
                        key={deadline.id}
                        className={`p-3 rounded-lg border-2 hover:shadow-md transition-all ${deadline.daysLeft === 0 ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-800 text-sm flex-1">{deadline.title}</h4>
                            <span
                                className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(
                                    deadline.priority
                                )}`}
                            >
                                {deadline.priority}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600">
                            <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{deadline.dueDate}</span>
                            </div>
                            <span className="text-gray-500">{deadline.team}</span>
                        </div>

                        {deadline.daysLeft === 0 && (
                            <div className="mt-2 flex items-center space-x-1 text-xs text-red-600 font-medium">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Due today!</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium py-2 rounded-lg hover:bg-purple-50 transition-colors">
                View All Deadlines →
            </button>
        </div>
    );
};

export default UpcomingDeadlines;
