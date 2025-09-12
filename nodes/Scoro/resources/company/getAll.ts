import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty } from '../../shared/descriptions';

const showOnlyForCompanyGetMany = {
    operation: ['getAll'],
    resource: ['company'],
};

export const companyGetManyDescription: INodeProperties[] = [
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForCompanyGetMany },
    }
];