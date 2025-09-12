import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty } from '../../shared/descriptions';

const showOnlyForTaskGetMany = {
    operation: ['getAll'],
    resource: ['task'],
};

export const taskGetManyDescription: INodeProperties[] = [
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForTaskGetMany },
    }
];