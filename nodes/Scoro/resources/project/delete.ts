import type { INodeProperties } from 'n8n-workflow';

export const showOnlyForProjectDelete = {
    operation: ['delete'],
    resource: ['project'],
};

export const projectDeleteDescription: INodeProperties[] = [
    {
        displayName: 'Project ID',
        name: 'projectId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: showOnlyForProjectDelete },
        description: 'The ID of the project to delete',
    },
];