import { Plus, Users, Calendar, BarChart3, FileText, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ onNewTask, onNewTeam, isManager, isAdmin }) => {
    const navigate = useNavigate();
    const actions = [
        {
            id: 'new-task',
            label: 'Add New Task',
            icon: Plus,
            color: 'from-blue-500 to-blue-600',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            onClick: onNewTask,
            show: isManager,
        },
        {
            id: 'new-team',
            label: 'Create Team',
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            onClick: onNewTeam,
            show: isAdmin || isManager,
        },
        {
            id: 'calendar',
            label: 'View Calendar',
            icon: Calendar,
            color: 'from-green-500 to-green-600',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            onClick: () => console.log('Calendar view'),
            show: true,
        },
        {
            id: 'reports',
            label: 'View Reports',
            icon: BarChart3,
            color: 'from-orange-500 to-orange-600',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            onClick: () => navigate('/reports'),
            show: true,
        },
    ];

    const visibleActions = actions.filter((a) => a.show);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {visibleActions.map((action) => {
                const Icon = action.icon;
                return (
                    <button
                        key={action.id}
                        onClick={action.onClick}
                        className="card group hover:scale-105 transition-all duration-200 text-center p-6"
                    >
                        <div className={`${action.iconBg} p-4 rounded-lg mx-auto w-fit mb-3`}>
                            <Icon className={`w-6 h-6 ${action.iconColor}`} />
                        </div>
                        <p className="text-sm font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
                            {action.label}
                        </p>
                    </button>
                );
            })}
        </div>
    );
};

export default QuickActions;
