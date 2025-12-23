import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import SmartOverviewCards from '../components/SmartOverviewCards';
import TaskBoard from '../components/TaskBoard';
import TaskModal from '../components/TaskModal';
import TeamModal from '../components/TeamModal';
import MyTasksWidget from '../components/MyTasksWidget';
import UpcomingDeadlines from '../components/UpcomingDeadlines';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import TaskStatusChart from '../components/TaskStatusChart';
import CommandPalette from '../components/CommandPalette';
import TimeTracker from '../components/TimeTracker';
import SmartSuggestions from '../components/SmartSuggestions';
import { Search, Filter, Zap } from 'lucide-react';

const Dashboard = () => {
    const { user, isManager, isAdmin } = useAuth();
    const toast = useToast();
    const [tasks, setTasks] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [focusMode, setFocusMode] = useState(false);
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tasksRes, teamsRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/teams'),
            ]);
            setTasks(tasksRes.data);
            setTeams(teamsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Global keyboard shortcuts
        const handleKeyDown = (e) => {
            // Ctrl+K or Cmd+K for command palette
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsPaletteOpen(true);
            }
            // N for new task
            if (e.key === 'n' && !e.ctrlKey && !e.metaKey && isManager) {
                const activeElement = document.activeElement;
                if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    setIsTaskModalOpen(true);
                }
            }
            // F for focus mode
            if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
                const activeElement = document.activeElement;
                if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    setFocusMode(!focusMode);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isManager, focusMode]);

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const { draggableId, destination } = result;
        const newStatus = destination.droppableId;

        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === draggableId ? { ...task, status: newStatus } : task
            )
        );

        try {
            await api.patch(`/tasks/${draggableId}`, { status: newStatus });
        } catch (error) {
            console.error('Error updating task:', error);
            fetchData();
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
            toast.success('Task deleted successfully!');
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
        }
    };

    const handleFilterChange = (filter) => {
        if (filter === 'all') {
            setStatusFilter('all');
            setSearchQuery('');
        } else if (filter === 'pending') {
            setStatusFilter('all');
            setSearchQuery('');
            // Would filter for pending tasks
        } else if (filter === 'overdue') {
            // Would show overdue tasks
            toast.info('Showing overdue tasks');
        }
    };

    // Filter and search tasks
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Get today's task count
    const todayTasks = tasks.filter((t) => t.status !== 'done').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Personalized Greeting */}
            <div className="card bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-fadeIn">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {getGreeting()}, {user?.name}! 👋
                        </h1>
                        <p className="text-blue-100">
                            You have <span className="font-bold">{todayTasks} tasks</span> pending today
                        </p>
                        <p className="text-sm text-blue-100 mt-1">
                            "Stay focused and keep crushing your goals! 💪"
                        </p>
                    </div>

                    {/* Focus Mode Toggle */}
                    <button
                        onClick={() => {
                            setFocusMode(!focusMode);
                            toast.info(focusMode ? 'Focus mode disabled' : 'Focus mode enabled');
                        }}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${focusMode
                            ? 'bg-white text-purple-600'
                            : 'bg-purple-700 text-white hover:bg-purple-800'
                            }`}
                    >
                        <Zap className="w-5 h-5" />
                        <span className="font-medium">{focusMode ? 'Exit Focus' : 'Focus Mode'}</span>
                    </button>
                </div>
            </div>

            {/* Smart Overview Cards */}
            <SmartOverviewCards tasks={tasks} onFilterChange={handleFilterChange} />

            {/* Quick Actions */}
            <QuickActions
                onNewTask={() => setIsTaskModalOpen(true)}
                onNewTeam={() => setIsTeamModalOpen(true)}
                isManager={isManager}
                isAdmin={isAdmin}
            />

            {!focusMode && (
                <>
                    {/* Search and Filter Bar */}
                    <div className="card animate-fadeIn">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tasks by title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full md:w-48 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none appearance-none bg-white"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                        </div>
                        {(searchQuery || statusFilter !== 'all') && (
                            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                                <span>
                                    Showing {filteredTasks.length} of {tasks.length} tasks
                                </span>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('all');
                                    }}
                                    className="text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column (2/3) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Task Status Chart */}
                            <TaskStatusChart tasks={tasks} />

                            {/* Task Board */}
                            <TaskBoard
                                tasks={filteredTasks}
                                onDragEnd={handleDragEnd}
                                onDeleteTask={handleDeleteTask}
                            />
                        </div>

                        {/* Right Column (1/3) */}
                        <div className="space-y-6">
                            {/* Smart Suggestions */}
                            <SmartSuggestions tasks={tasks} />

                            {/* My Tasks Widget */}
                            <MyTasksWidget tasks={tasks} user={user} />

                            {/* Time Tracker */}
                            <TimeTracker />

                            {/* Upcoming Deadlines */}
                            <UpcomingDeadlines tasks={tasks} />

                            {/* Recent Activity */}
                            <RecentActivity />
                        </div>
                    </div>
                </>
            )}

            {focusMode && (
                <div className="space-y-6">
                    <div className="card text-center py-8">
                        <Zap className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Focus Mode Active</h2>
                        <p className="text-gray-600">Showing only today's tasks to keep you focused</p>
                    </div>

                    <TaskBoard
                        tasks={filteredTasks.filter((t) => t.status !== 'done').slice(0, 6)}
                        onDragEnd={handleDragEnd}
                        onDeleteTask={handleDeleteTask}
                    />
                </div>
            )}

            {/* Command Palette */}
            <CommandPalette
                isOpen={isPaletteOpen}
                onClose={() => setIsPaletteOpen(false)}
                onCreateTask={() => setIsTaskModalOpen(true)}
                onCreateTeam={() => setIsTeamModalOpen(true)}
            />

            {/* Modals */}
            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSuccess={() => {
                    fetchData();
                    toast.success('Task created successfully!');
                }}
                teams={teams}
            />

            <TeamModal
                isOpen={isTeamModalOpen}
                onClose={() => setIsTeamModalOpen(false)}
                onSuccess={() => {
                    fetchData();
                    toast.success('Team created successfully!');
                }}
            />
        </div>
    );
};

export default Dashboard;
