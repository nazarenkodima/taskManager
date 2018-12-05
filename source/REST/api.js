import { MAIN_URL, TOKEN } from './config';

export const api = {

    async _createTask (message) {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message }),
        });

        const { data: task } = await response.json();

        return task;
    },

    async _updateTaskApi (task) {
        const response = await fetch(`${MAIN_URL}`, {
            method:  'PUT',
            headers: {
                Authorization:  TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([task]),
        });

        if (response.status !== 200) {
            throw new Error('Task were not updated');
        } else {
            const { data: [tasks] } = await response.json();

            return tasks;
        }
    },
};
