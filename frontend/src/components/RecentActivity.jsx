import { UserPlus, CheckCircle, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';

const RecentActivity = () => {
    const activities = [
        {
            id: 1,
            type: 'assignment',
            icon: UserPlus,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            message: 'You assigned Design UI to Rahul',
            time: '2 hours ago',
        },
        {
            id: 2,
            type: 'completion',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            message: 'Priya completed API Integration',
            time: '4 hours ago',
        },
        {
            id: 3,
            type: 'deadline',
            icon: CalendarIcon,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            message: 'Deadline updated for Testing Phase',
            time: '5 hours ago',
        },
        {
            id: 4,
            type: 'alert',
            icon: AlertCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
            message: 'High priority task needs review',
            time: '6 hours ago',
        },
    ];

    return (
        <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>

            <div className="space-y-4">
                {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                        <div key={activity.id} className="flex items-start space-x-3">
                            {/* Timeline line */}
                            <div className="flex flex-col items-center">
                                <div className={`${activity.bgColor} p-2 rounded-full`}>
                                    <Icon className={`w-4 h-4 ${activity.color}`} />
                                </div>
                                {index < activities.length - 1 && (
                                    <div className="w-0.5 h-full bg-gray-200 mt-2" />
                                )}
                            </div>

                            {/* Activity content */}
                            <div className="flex-1 pb-4">
                                <p className="text-sm text-gray-800 mb-1">{activity.message}</p>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button className="w-full mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium py-2 rounded-lg hover:bg-purple-50 transition-colors">
                View All Activity →
            </button>
        </div>
    );
};

export default RecentActivity;
