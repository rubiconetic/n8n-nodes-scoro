import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty } from '../../shared/descriptions';

const showOnlyForStatusGetMany = {
    operation: ['getAll'],
    resource: ['status'],
};

export const statusGetManyDescription: INodeProperties[] = [
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForStatusGetMany },
    }
];