import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCalendarGet = {
    operation: ['get'],
    resource: ['calendar'],
};

export const calendarGetDescription: INodeProperties[] = [
    {
        displayName: 'Calendar',
        name: 'calendarId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForCalendarGet },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                typeOptions: {
                    searchListMethod: 'getCalendarEvents',
                    searchable: true,
                },
            },
            {
                displayName: 'By ID',
                name: 'id',
                type: 'string',
            },
        ],
    },
];