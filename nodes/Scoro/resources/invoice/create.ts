import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

const showOnlyForInvoiceCreate = {
    operation: ['create'],
    resource: ['invoice'],
};

export const invoiceCreateDescription: INodeProperties[] = [
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyForInvoiceCreate,
        },
        description: 'The request body for creating an invoice.',
    }
];