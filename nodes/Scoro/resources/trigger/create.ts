import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

const showOnlyForTriggerCreate = {
    operation: ['create'],
    resource: ['trigger'],
};

export const triggerCreateDescription: INodeProperties[] = [
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyForTriggerCreate,
        },
        description: 'The request body for creating a trigger.',

    }
];