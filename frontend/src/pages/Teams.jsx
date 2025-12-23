import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { Users, Trash2, Calendar, User as UserIcon } from 'lucide-react';
import TeamModal from '../components/TeamModal';

const Teams = () => {
    const { user, isAdmin, isManager } = useAuth();
    const toast = useToast();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const response = await api.get('/teams');
            setTeams(response.data);
        } catch (error) {
            console.error('Error fetching teams:', error);
            toast.error('Failed to load teams');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleDeleteTeam = async (teamId, teamName) => {
        if (!window.confirm(`Are you sure you want to delete team "${teamName}"?`)) return;

        try {
            await api.delete(`/teams/${teamId}`);
            setTeams((prev) => prev.filter((team) => team._id !== teamId));
            toast.success(`Team "${teamName}" deleted successfully`);
        } catch (error) {
            console.error('Error deleting team:', error);
            toast.error('Failed to delete team');
        }
    };

    const handleTeamCreated = () => {
        fetchTeams();
        toast.success('Team created successfully!');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                        <Users className="w-8 h-8 text-purple-600" />
                        <span>Teams</span>
                    </h1>
                    <p className="text-gray-600 mt-1">Manage your teams and members</p>
                </div>

                {(isAdmin || isManager) && (
                    <button
                        onClick={() => setIsTeamModalOpen(true)}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Users className="w-5 h-5" />
                        <span>Create Team</span>
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Total Teams</p>
                            <p className="text-3xl font-bold mt-1">{teams.length}</p>
                        </div>
                        <Users className="w-12 h-12 text-purple-200" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Your Role</p>
                            <p className="text-2xl font-bold mt-1 capitalize">{user?.role}</p>
                        </div>
                        <UserIcon className="w-12 h-12 text-blue-200" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Active Projects</p>
                            <p className="text-3xl font-bold mt-1">{teams.length}</p>
                        </div>
                        <Calendar className="w-12 h-12 text-green-200" />
                    </div>
                </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <div
                        key={team._id}
                        className="card group hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            {(isAdmin || isManager) && (
                                <button
                                    onClick={() => handleDeleteTeam(team._id, team.name)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-2">{team.name}</h3>

                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <UserIcon className="w-4 h-4" />
                            <span>Created by {team.createdBy?.name || 'Unknown'}</span>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Created</span>
                                <span className="text-gray-700 font-medium">
                                    {new Date(team.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {teams.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No teams yet</h3>
                        <p className="text-gray-500">
                            {isAdmin || isManager
                                ? 'Create your first team to get started!'
                                : 'Teams will appear here once created.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Team Modal */}
            <TeamModal
                isOpen={isTeamModalOpen}
                onClose={() => setIsTeamModalOpen(false)}
                onSuccess={handleTeamCreated}
            />
        </div>
    );
};

export default Teams;
