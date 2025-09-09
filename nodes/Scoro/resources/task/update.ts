import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

export const showOnlyForTaskUpdate = {
    operation: ['update'],
    resource: ['task'],
};

export const taskUpdateDescription: INodeProperties[] = [
    {
        displayName: 'Task',
        name: 'taskId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForTaskUpdate },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                placeholder: 'Select a task...',
                typeOptions: {
                    searchListMethod: 'getTasks',
                    searchable: true,
                },
            },
            {
                displayName: 'By ID',
                name: 'id',
                type: 'string',
                placeholder: 'Enter Task ID',
                validation: [
                    {
                        type: 'regex',
                        properties: {
                            regex: '^[0-9]+$',
                            errorMessage: 'Task ID must be numeric',
                        },
                    },
                ],
            },
        ],
    },
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyForTaskUpdate,
        }
    }
];