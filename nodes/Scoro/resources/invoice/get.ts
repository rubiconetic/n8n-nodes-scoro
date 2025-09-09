import type { INodeProperties } from 'n8n-workflow';

const showOnlyForInvoiceGet = {
    operation: ['get'],
    resource: ['invoice'],
};

export const invoiceGetDescription: INodeProperties[] = [
    {
        displayName: 'Invoice',
        name: 'invoiceId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForInvoiceGet },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                typeOptions: {
                    searchListMethod: 'getInvoices',
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