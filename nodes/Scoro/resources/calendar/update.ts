import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

export const showOnlyForCalendarUpdate = {
    operation: ['update'],
    resource: ['calendar'],
};

export const calendarUpdateDescription: INodeProperties[] = [
    {
        displayName: 'Calendar',
        name: 'calendarId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForCalendarUpdate },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                placeholder: 'Select a calendar...',
                typeOptions: {
                    searchListMethod: 'getCalendarEvents',
                    searchable: true,
                },
            },
            {
                displayName: 'By ID',
                name: 'id',
                type: 'string',
                placeholder: 'Enter Calendar ID',
                validation: [
                    {
                        type: 'regex',
                        properties: {
                            regex: '^[0-9]+$',
                            errorMessage: 'Calendar ID must be numeric',
                        },
                    },
                ],
            },
        ],
    },
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyForCalendarUpdate,
        }
    }
];