import type { INodeProperties } from 'n8n-workflow';
// eslint-disable-next-line import-x/no-unresolved
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