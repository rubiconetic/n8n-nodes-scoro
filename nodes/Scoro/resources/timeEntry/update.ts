import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

export const showOnlyForTimeEntryUpdate = {
    operation: ['update'],
    resource: ['timeEntry'],
};

export const timeEntryUpdateDescription: INodeProperties[] = [
    {
        displayName: 'TimeEntry',
        name: 'timeEntryId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForTimeEntryUpdate },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                placeholder: 'Select a timeEntry...',
                typeOptions: {
                    searchListMethod: 'getTimeEntries',
                    searchable: true,
                },
            },
            {
                displayName: 'By ID',
                name: 'id',
                type: 'string',
                placeholder: 'Enter Time Entry ID',
                validation: [
                    {
                        type: 'regex',
                        properties: {
                            regex: '^[0-9]+$',
                            errorMessage: 'Time Entry ID must be numeric',
                        },
                    },
                ],
            },
        ],
    },
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyForTimeEntryUpdate,
        }
    }
];