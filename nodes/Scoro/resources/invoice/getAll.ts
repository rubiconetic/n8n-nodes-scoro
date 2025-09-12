import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty } from '../../shared/descriptions';

const showOnlyForInvoiceGetMany = {
    operation: ['getAll'],
    resource: ['invoice'],
};

export const invoiceGetManyDescription: INodeProperties[] = [
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForInvoiceGetMany },
    }
];