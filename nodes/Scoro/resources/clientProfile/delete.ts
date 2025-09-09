import type { INodeProperties } from 'n8n-workflow';

export const showOnlyForClientProfileDelete = {
    operation: ['delete'],
    resource: ['clientProfile'],
};

export const clientProfileDeleteDescription: INodeProperties[] = [
    {
        displayName: 'Client Profile ID',
        name: 'clientProfileId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: showOnlyForClientProfileDelete },
        description: 'The ID of the clientProfile to delete',
    },
];