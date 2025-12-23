import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Users, UserPlus } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            TaskTeam
                        </h1>

                        {/* Navigation Links */}
                        <div className="hidden md:flex space-x-4">
                            <Link
                                to="/dashboard"
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive('/dashboard')
                                    ? 'bg-purple-100 text-purple-600 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                to="/teams"
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive('/teams')
                                    ? 'bg-purple-100 text-purple-600 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Users className="w-4 h-4" />
                                <span>Teams</span>
                            </Link>
                            {(user?.role === 'manager' || user?.role === 'admin') && (
                                <Link
                                    to="/assign-tasks"
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive('/assign-tasks')
                                        ? 'bg-purple-100 text-purple-600 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span>Assign Tasks</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Notification Bell */}
                        <NotificationBell />

                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
