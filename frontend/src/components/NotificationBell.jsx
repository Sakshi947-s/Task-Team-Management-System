import { Bell } from 'lucide-react';
import { useState } from 'react';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications] = useState([
        {
            id: 1,
            type: 'task',
            message: 'New task assigned: Design Homepage',
            time: '5 min ago',
            unread: true,
        },
        {
            id: 2,
            type: 'deadline',
            message: 'Deadline approaching: API Integration',
            time: '1 hour ago',
            unread: true,
        },
        {
            id: 3,
            type: 'team',
            message: 'You were added to Marketing Team',
            time: '2 hours ago',
            unread: false,
        },
    ]);

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-fadeIn">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <p className="text-xs text-gray-500">{unreadCount} unread</p>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${notif.unread ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800">{notif.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 text-center border-t border-gray-200">
                        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                            View All Notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
