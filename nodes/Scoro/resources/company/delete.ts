import type { INodeProperties } from 'n8n-workflow';

export const showOnlyForCompanyDelete = {
    operation: ['delete'],
    resource: ['company'],
};

export const companyDeleteDescription: INodeProperties[] = [
    {
        displayName: 'Company ID',
        name: 'companyId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: showOnlyForCompanyDelete },
        description: 'The ID of the company to delete',
    },
];