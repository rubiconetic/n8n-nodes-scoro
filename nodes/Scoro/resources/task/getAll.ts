import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty, splitOutputProperty } from '../../shared/descriptions';

const showOnlyForTaskGetMany = {
    operation: ['getAll'],
    resource: ['task'],
};

export const taskGetManyDescription: INodeProperties[] = [
    {
        ...splitOutputProperty,
        displayOptions: { show: showOnlyForTaskGetMany },
    },
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForTaskGetMany },
    }
];