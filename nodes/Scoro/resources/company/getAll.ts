import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty, splitOutputProperty } from '../../shared/descriptions';

const showOnlyForCompanyGetMany = {
    operation: ['getAll'],
    resource: ['company'],
};

export const companyGetManyDescription: INodeProperties[] = [
    {
        ...splitOutputProperty,
        displayOptions: { show: showOnlyForCompanyGetMany },
    },
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForCompanyGetMany },
    }
];