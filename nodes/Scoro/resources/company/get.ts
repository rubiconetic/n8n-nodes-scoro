import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCompanyGet = {
    operation: ['get'],
    resource: ['company'],
};

export const companyGetDescription: INodeProperties[] = [
    {
        displayName: 'Company',
        name: 'companyId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForCompanyGet },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                typeOptions: {
                    searchListMethod: 'getCompanies',
                    searchable: true,
                },
            },
            {
                displayName: 'By ID',
                name: 'id',
                type: 'string',
                placeholder: 'Enter Company ID',
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