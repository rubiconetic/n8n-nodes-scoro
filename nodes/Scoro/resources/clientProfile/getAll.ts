import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty } from '../../shared/descriptions';

const showOnlyForClientProfileGetMany = {
    operation: ['getAll'],
    resource: ['clientProfile'],
};

export const clientProfileGetManyDescription: INodeProperties[] = [
    // {
    //     ...splitOutputProperty,
    //     displayOptions: { show: showOnlyForClientProfileGetMany },
    // },
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForClientProfileGetMany },
    }
];