import { Play, Pause, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const TimeTracker = ({ task }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [totalTime] = useState(3725); // Mock: 1h 2m 5s total time

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span>Time Tracking</span>
            </h3>

            {/* Current Session */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Current Session</p>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-800 font-mono">{formatTime(time)}</span>
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`p-3 rounded-lg transition-all ${isRunning
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-green-500 hover:bg-green-600'
                            } text-white`}
                    >
                        {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1">Today</p>
                    <p className="text-lg font-bold text-gray-800">{formatTime(time)}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600 mb-1">Total</p>
                    <p className="text-lg font-bold text-gray-800">{formatTime(totalTime)}</p>
                </div>
            </div>

            {/* Weekly Summary Mockup */}
            <div className="mt-4">
                <p className="text-xs text-gray-600 mb-2">This Week</p>
                <div className="flex items-end space-x-2 h-16">
                    {[40, 60, 45, 80, 55, 30, 20].map((height, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-purple-500 rounded-t hover:bg-purple-600 transition-colors"
                            style={{ height: `${height}%` }}
                            title={`${Math.floor((height / 100) * 8)}h`}
                        />
                    ))}
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                </div>
            </div>
        </div>
    );
};

export default TimeTracker;
