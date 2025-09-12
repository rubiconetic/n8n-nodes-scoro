import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTriggerGet = {
    operation: ['get'],
    resource: ['trigger'],
};

export const triggerGetDescription: INodeProperties[] = [
    {
        displayName: 'Trigger',
        name: 'triggerId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForTriggerGet },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                typeOptions: {
                    searchListMethod: 'getTriggers',
                    searchable: true,
                },
            },
            {
                displayName: 'By ID',
                name: 'id',
                type: 'string',
                placeholder: 'Enter Trigger ID',
                validation: [
                    {
                        type: 'regex',
                        properties: {
                            regex: '^[0-9]+$',
                            errorMessage: 'Trigger ID must be numeric',
                        },
                    },
                ],
            },
        ],
    },
];