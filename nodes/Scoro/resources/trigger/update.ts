import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

export const showOnlyForTriggerUpdate = {
    operation: ['update'],
    resource: ['trigger'],
};

export const triggerUpdateDescription: INodeProperties[] = [
    {
        displayName: 'Trigger',
        name: 'triggerId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForTriggerUpdate },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                placeholder: 'Select a trigger...',
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
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyForTriggerUpdate,
        }
    }
];