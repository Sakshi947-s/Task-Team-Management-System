import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const getStatusColor = (status) => {
    const colors = {
        todo: 'badge-todo',
        'in-progress': 'badge-in-progress',
        done: 'badge-done',
    };
    return colors[status] || 'badge-todo';
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
};
