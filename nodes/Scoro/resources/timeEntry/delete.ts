import type { INodeProperties } from 'n8n-workflow';

export const showOnlyForTimeEntryDelete = {
    operation: ['delete'],
    resource: ['timeEntry'],
};

export const timeEntryDeleteDescription: INodeProperties[] = [
    {
        displayName: 'TimeEntry ID',
        name: 'timeEntryId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: showOnlyForTimeEntryDelete },
        description: 'The ID of the timeEntry to delete',
    },
];