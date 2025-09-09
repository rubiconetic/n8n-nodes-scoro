import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

export const showOnlyForCompanyUpdate = {
    operation: ['update'],
    resource: ['company'],
};

export const companyUpdateDescription: INodeProperties[] = [
    {
        displayName: 'Company',
        name: 'companyId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForCompanyUpdate },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                placeholder: 'Select a company...',
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
                            regex: '^[0-9]+$',
                            errorMessage: 'Company ID must be numeric',
                        },
                    },
                ],
            },
        ],
    },
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyForCompanyUpdate,
        }
    }
];