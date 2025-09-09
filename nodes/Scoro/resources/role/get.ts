import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRoleGet = {
    operation: ['get'],
    resource: ['role'],
};

export const roleGetDescription: INodeProperties[] = [
    {
        displayName: 'Role',
        name: 'roleId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForRoleGet },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                typeOptions: {
                    searchListMethod: 'getRoles',
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