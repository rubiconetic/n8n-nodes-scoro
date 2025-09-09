import type { INodeProperties } from 'n8n-workflow';

export const showOnlyForTimeEntrySetDone = {
    operation: ['setDone'],
    resource: ['timeEntry'],
};

export const timeEntrySetDoneDescription: INodeProperties[] = [
    {
        displayName: 'Time Entry',
        name: 'timeEntryId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForTimeEntrySetDone },
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
    }
];