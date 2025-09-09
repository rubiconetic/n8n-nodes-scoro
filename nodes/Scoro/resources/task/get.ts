import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTaskGet = {
    operation: ['get'],
    resource: ['task'],
};

export const taskGetDescription: INodeProperties[] = [
    {
        displayName: 'Task',
        name: 'taskId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForTaskGet },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                typeOptions: {
                    searchListMethod: 'getTasks',
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