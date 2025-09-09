import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

const showOnlyForCompanyCreate = {
    operation: ['create'],
    resource: ['company'],
};

export const companyCreateDescription: INodeProperties[] = [
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyForCompanyCreate,
        },
        description: 'The request body for creating a company.',

    }
];