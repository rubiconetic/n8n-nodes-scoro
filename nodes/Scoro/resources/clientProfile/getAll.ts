import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty } from '../../shared/descriptions';

const showOnlyForClientProfileGetMany = {
    operation: ['getAll'],
    resource: ['clientProfile'],
};

export const clientProfileGetManyDescription: INodeProperties[] = [
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForClientProfileGetMany },
    }
];