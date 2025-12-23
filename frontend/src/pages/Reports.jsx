import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import TaskStatusChart from '../components/TaskStatusChart';

const Reports = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                    <span>Project Reports</span>
                </h1>
                <p className="text-gray-600 mt-1">Overview of project progress and task distribution</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Total Tasks</p>
                            <p className="text-3xl font-bold mt-1">{totalTasks}</p>
                        </div>
                        <BarChart3 className="w-12 h-12 text-purple-200" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Completion Rate</p>
                            <p className="text-3xl font-bold mt-1">{completionRate}%</p>
                        </div>
                        <CheckCircle className="w-12 h-12 text-green-200" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm">Pending</p>
                            <p className="text-3xl font-bold mt-1">{pendingTasks}</p>
                        </div>
                        <Clock className="w-12 h-12 text-orange-200" />
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TaskStatusChart tasks={tasks} />

                {/* Additional placeholder chart or list */}
                <div className="card">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Task Priority</h3>
                    {/* Simple priority distribution logic could go here, for now placeholder */}
                    <div className="flex items-center justify-center h-48 text-gray-400">
                        <p>Priority breakdown coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
