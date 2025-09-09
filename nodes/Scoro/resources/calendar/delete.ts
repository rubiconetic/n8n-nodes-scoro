import type { INodeProperties } from 'n8n-workflow';

export const showOnlyForCalendarDelete = {
    operation: ['delete'],
    resource: ['calendar'],
};

export const calendarDeleteDescription: INodeProperties[] = [
    {
        displayName: 'Calendar ID',
        name: 'calendarId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: showOnlyForCalendarDelete },
        description: 'The ID of the calendar to delete',
    },
];