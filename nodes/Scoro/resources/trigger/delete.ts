import type { INodeProperties } from 'n8n-workflow';

export const showOnlyForTriggerDelete = {
    operation: ['delete'],
    resource: ['trigger'],
};

export const triggerDeleteDescription: INodeProperties[] = [
    {
        displayName: 'Trigger ID',
        name: 'triggerId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: showOnlyForTriggerDelete },
        description: 'The ID of the trigger to delete',
    },
];