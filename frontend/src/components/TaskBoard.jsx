import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getStatusColor } from '../utils/helpers';
import { MoreVertical, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TaskBoard = ({ tasks, onDragEnd, onDeleteTask }) => {
    const { user, isManager, isAdmin } = useAuth();

    const columns = {
        todo: { title: 'To Do', tasks: [] },
        'in-progress': { title: 'In Progress', tasks: [] },
        done: { title: 'Done', tasks: [] },
    };

    // Group tasks by status
    tasks.forEach((task) => {
        if (columns[task.status]) {
            columns[task.status].tasks.push(task);
        }
    });

    const canDeleteTask = (task) => {
        return isManager || isAdmin || task.assignedTo?._id === user?._id;
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(columns).map(([status, column]) => (
                    <div key={status} className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg text-gray-800">{column.title}</h3>
                            <span className={`badge ${getStatusColor(status)}`}>
                                {column.tasks.length}
                            </span>
                        </div>

                        <Droppable droppableId={status}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`min-h-[400px] space-y-3 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''
                                        } rounded-lg p-2 transition-colors`}
                                >
                                    {column.tasks.map((task, index) => (
                                        <Draggable
                                            key={task._id}
                                            draggableId={task._id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-200 ${snapshot.isDragging ? 'rotate-2 scale-105' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h4 className="font-semibold text-gray-800 flex-1">
                                                            {task.title}
                                                        </h4>
                                                        {canDeleteTask(task) && (
                                                            <button
                                                                onClick={() => onDeleteTask(task._id)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xs text-gray-500">Team:</span>
                                                            <span className="text-xs font-medium text-purple-600">
                                                                {task.team?.name || 'N/A'}
                                                            </span>
                                                        </div>
                                                        {task.assignedTo && (
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-xs text-gray-500">Assigned:</span>
                                                                <span className="text-xs font-medium text-blue-600">
                                                                    {task.assignedTo.name}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
};

export default TaskBoard;
