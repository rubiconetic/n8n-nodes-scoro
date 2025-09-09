import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty } from '../../shared/descriptions';

const showOnlyForInvoiceGetMany = {
    operation: ['getAll'],
    resource: ['invoice'],
};

export const invoiceGetManyDescription: INodeProperties[] = [
    // {
    //     ...splitOutputProperty,
    //     displayOptions: { show: showOnlyForInvoiceGetMany },
    // },
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForInvoiceGetMany },
    }
];