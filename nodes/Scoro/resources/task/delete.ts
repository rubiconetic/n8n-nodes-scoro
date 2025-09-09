import type { INodeProperties } from 'n8n-workflow';

export const showOnlyForTaskDelete = {
    operation: ['delete'],
    resource: ['task'],
};

export const taskDeleteDescription: INodeProperties[] = [
    {
        displayName: 'Task ID',
        name: 'taskId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: showOnlyForTaskDelete },
        description: 'The ID of the task to delete',
    },
];