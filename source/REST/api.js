import { MAIN_URL, TOKEN } from './config';

export const api = {
    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                Authorization: TOKEN,
            },
        });
        const { data: tasks } = await response.json();

        return tasks;
    },

    async createTask (message) {
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

    async updateTask (task) {
        const response = await fetch(`${MAIN_URL}`, {
            method:  'PUT',
            headers: {
                Authorization:  TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([task]),
        });

        const { data: tasks } = await response.json();

        return tasks;

    },

    async removeTask (id) {
        await fetch(`${MAIN_URL}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });
    },
    async completeAllTasks (tasks) {
        const currentTasks = tasks.map((task) => {
            return fetch(`${MAIN_URL}`, {
                method:  'PUT',
                headers: {
                    Authorization:  TOKEN,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([task]),
            });
        });

        await Promise.all(currentTasks).then(
            (resolve) => {
                resolve.forEach((response) => {
                    if (response.status !== 200) {
                        throw new Error('Task were not updated');
                    }
                });
            },
            (reject) => `Tasks were not updated, ${reject.message}`
        );
    },
};
