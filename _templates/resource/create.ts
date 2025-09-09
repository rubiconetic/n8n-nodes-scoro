import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

const showOnlyFor__Resource_PascalCase__Create = {
    operation: ['create'],
    resource: ['__resource_singular__'],
};

export const __resource_singular__CreateDescription: INodeProperties[] = [
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyFor__Resource_PascalCase__Create,
        },
        description: 'The request body for creating a __resource_singular__.',

    }
];