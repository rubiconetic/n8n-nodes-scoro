import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

const showOnlyForClientProfileCreate = {
    operation: ['create'],
    resource: ['clientProfile'],
};

export const clientProfileCreateDescription: INodeProperties[] = [
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyForClientProfileCreate,
        },
        description: 'The request body for creating a client profile.',

    }
];