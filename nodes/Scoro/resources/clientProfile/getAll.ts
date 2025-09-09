import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty, splitOutputProperty } from '../../shared/descriptions';

const showOnlyForClientProfileGetMany = {
    operation: ['getAll'],
    resource: ['clientProfile'],
};

export const clientProfileGetManyDescription: INodeProperties[] = [
    {
        ...splitOutputProperty,
        displayOptions: { show: showOnlyForClientProfileGetMany },
    },
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForClientProfileGetMany },
    }
];