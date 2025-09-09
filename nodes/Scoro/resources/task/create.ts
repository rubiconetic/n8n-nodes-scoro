import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

const showOnlyForTaskCreate = {
    operation: ['create'],
    resource: ['task'],
};

export const taskCreateDescription: INodeProperties[] = [
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyForTaskCreate,
        }
    }
];