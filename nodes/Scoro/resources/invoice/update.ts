import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

export const showOnlyForInvoiceUpdate = {
    operation: ['update'],
    resource: ['invoice'],
};

export const invoiceUpdateDescription: INodeProperties[] = [
    {
        displayName: 'Invoice',
        name: 'invoiceId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForInvoiceUpdate },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                placeholder: 'Select a invoice...',
                typeOptions: {
                    searchListMethod: 'getInvoices',
                    searchable: true,
                },
            },
            {
                displayName: 'By ID',
                name: 'id',
                type: 'string',
                placeholder: 'Enter Invoice ID',
                validation: [
                    {
                        type: 'regex',
                        properties: {
                            regex: '^[0-9]+$',
                            errorMessage: 'Invoice ID must be numeric',
                        },
                    },
                ],
            },
        ],
    },
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyForInvoiceUpdate,
        }
    }
];