import type { INodeProperties } from 'n8n-workflow';

const showOnlyForClientProfileGet = {
    operation: ['get'],
    resource: ['clientProfile'],
};

export const clientProfileGetDescription: INodeProperties[] = [
    {
        displayName: 'ClientProfile',
        name: 'clientProfileId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForClientProfileGet },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                typeOptions: {
                    searchListMethod: 'getClientProfiles',
                    searchable: true,
                },
            },
            {
                displayName: 'By ID',
                name: 'id',
                type: 'string',
                placeholder: 'Enter Client Profile ID',
                validation: [
                    {
                        type: 'regex',
                        properties: {
                            regex: '^[0-9]+$', // Ensure it's a number
                            errorMessage: 'User ID must be numeric',
                        },
                    },
                ],
            },
        ],
    },
];