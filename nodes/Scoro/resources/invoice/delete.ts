import type { INodeProperties } from 'n8n-workflow';

export const showOnlyForInvoiceDelete = {
    operation: ['delete'],
    resource: ['invoice'],
};

export const invoiceDeleteDescription: INodeProperties[] = [
    {
        displayName: 'Invoice ID',
        name: 'invoiceId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: showOnlyForInvoiceDelete },
        description: 'The ID of the invoice to delete',
    },
];