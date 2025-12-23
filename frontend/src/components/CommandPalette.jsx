import { useState, useEffect } from 'react';
import { Search, X, Plus, Users, LayoutDashboard, Calendar, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommandPalette = ({ isOpen, onClose, onCreateTask, onCreateTeam }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const commands = [
        {
            id: 'new-task',
            label: 'Create New Task',
            icon: Plus,
            shortcut: 'N',
            action: () => {
                onClose();
                onCreateTask();
            },
        },
        {
            id: 'new-team',
            label: 'Create New Team',
            icon: Users,
            shortcut: 'T',
            action: () => {
                onClose();
                onCreateTeam();
            },
        },
        {
            id: 'dashboard',
            label: 'Go to Dashboard',
            icon: LayoutDashboard,
            shortcut: 'D',
            action: () => {
                navigate('/dashboard');
                onClose();
            },
        },
        {
            id: 'teams',
            label: 'Go to Teams',
            icon: Users,
            shortcut: 'E',
            action: () => {
                navigate('/teams');
                onClose();
            },
        },
        {
            id: 'focus',
            label: 'Toggle Focus Mode',
            icon: Zap,
            shortcut: 'F',
            action: () => {
                onClose();
                // Parent will handle focus mode
            },
        },
    ];

    const filteredCommands = commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl+K or Cmd+K to open
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (!isOpen) {
                    // Would be handled by parent
                }
            }
            // Escape to close
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black bg-opacity-50 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-slideIn">
                {/* Search Input */}
                <div className="flex items-center border-b border-gray-200 p-4">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        type="text"
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 text-lg outline-none"
                        autoFocus
                    />
                    <button
                        onClick={onClose}
                        className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Commands List */}
                <div className="max-h-96 overflow-y-auto">
                    {filteredCommands.length > 0 ? (
                        filteredCommands.map((cmd) => {
                            const Icon = cmd.icon;
                            return (
                                <button
                                    key={cmd.id}
                                    onClick={cmd.action}
                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-50 transition-colors text-left group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                                            <Icon className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <span className="text-gray-800 font-medium">{cmd.label}</span>
                                    </div>
                                    <kbd className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded font-mono">
                                        {cmd.shortcut}
                                    </kbd>
                                </button>
                            );
                        })
                    ) : (
                        <div className="py-12 text-center text-gray-500">
                            <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No commands found</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
                    <span>Press Ctrl+K to toggle</span>
                    <span>ESC to close</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
