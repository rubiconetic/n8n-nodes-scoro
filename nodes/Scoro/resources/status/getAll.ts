import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty, splitOutputProperty } from '../../shared/descriptions';

const showOnlyForStatusGetMany = {
    operation: ['getAll'],
    resource: ['status'],
};

export const statusGetManyDescription: INodeProperties[] = [
    {
        ...splitOutputProperty,
        displayOptions: { show: showOnlyForStatusGetMany },
    },
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForStatusGetMany },
    }
];