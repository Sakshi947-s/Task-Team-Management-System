import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { UserPlus, Users as UsersIcon, CheckSquare } from 'lucide-react';

const AssignTasks = () => {
    const { user, isManager, isAdmin } = useAuth();
    const toast = useToast();
    const [tasks, setTasks] = useState([]);
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tasksRes, teamsRes, usersRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/teams'),
                api.get('/users'),
            ]);
            setTasks(tasksRes.data);
            setTeams(teamsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignTask = async () => {
        if (!selectedTask || !selectedUser) {
            toast.warning('Please select both a task and a user');
            return;
        }

        try {
            await api.patch(`/tasks/${selectedTask}`, { assignedTo: selectedUser });
            toast.success('Task assigned successfully!');
            setSelectedTask('');
            setSelectedUser('');
            fetchData();
        } catch (error) {
            console.error('Error assigning task:', error);
            toast.error('Failed to assign task');
        }
    };

    const unassignedTasks = tasks.filter((t) => !t.assignedTo || t.assignedTo === null);
    const assignedTasks = tasks.filter((t) => t.assignedTo);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!isManager && !isAdmin) {
        return (
            <div className="text-center py-12">
                <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                <p className="text-gray-600">Only Managers and Admins can assign tasks.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                    <UserPlus className="w-8 h-8 text-purple-600" />
                    <span>Assign Tasks</span>
                </h1>
                <p className="text-gray-600 mt-1">Assign tasks to team members</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Total Tasks</p>
                            <p className="text-3xl font-bold mt-1">{tasks.length}</p>
                        </div>
                        <CheckSquare className="w-12 h-12 text-blue-200" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm">Unassigned</p>
                            <p className="text-3xl font-bold mt-1">{unassignedTasks.length}</p>
                        </div>
                        <UserPlus className="w-12 h-12 text-orange-200" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Assigned</p>
                            <p className="text-3xl font-bold mt-1">{assignedTasks.length}</p>
                        </div>
                        <UsersIcon className="w-12 h-12 text-green-200" />
                    </div>
                </div>
            </div>

            {/* Assignment Form */}
            <div className="card">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Assign</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Task</label>
                        <select
                            value={selectedTask}
                            onChange={(e) => setSelectedTask(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Choose a task...</option>
                            {unassignedTasks.map((task) => (
                                <option key={task._id} value={task._id}>
                                    {task.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Choose a user...</option>
                            {users.map((u) => (
                                <option key={u._id} value={u._id}>
                                    {u.name} ({u.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={handleAssignTask}
                            disabled={!selectedTask || !selectedUser}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <UserPlus className="w-5 h-5 inline mr-2" />
                            Assign Task
                        </button>
                    </div>
                </div>
            </div>

            {/* Unassigned Tasks List */}
            <div className="card">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Unassigned Tasks</h3>

                {unassignedTasks.length > 0 ? (
                    <div className="space-y-3">
                        {unassignedTasks.map((task) => (
                            <div
                                key={task._id}
                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">{task.title}</h4>
                                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                            <span className="badge badge-{task.status}">
                                                {task.status.replace('-', ' ')}
                                            </span>
                                            <span>{task.team?.name || 'No team'}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedTask(task._id)}
                                        className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                                    >
                                        Assign →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <CheckSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>All tasks are assigned!</p>
                    </div>
                )}
            </div>

            {/* Assigned Tasks List */}
            <div className="card">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recently Assigned</h3>

                {assignedTasks.length > 0 ? (
                    <div className="space-y-3">
                        {assignedTasks.slice(0, 5).map((task) => (
                            <div
                                key={task._id}
                                className="p-4 bg-green-50 rounded-lg border border-green-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">{task.title}</h4>
                                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                            <span className="badge badge-{task.status}">
                                                {task.status.replace('-', ' ')}
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <UserPlus className="w-3 h-3" />
                                                <span>{task.assignedTo?.name || 'Unknown'}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <UserPlus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No assigned tasks yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignTasks;
