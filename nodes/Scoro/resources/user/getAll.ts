import type { INodeProperties } from 'n8n-workflow';
import {
    getManyOptionsProperty,
} from '../../shared/descriptions';

const showOnlyForUserGetMany = {
    operation: ['getAll'],
    resource: ['user'],
};

export const userGetManyDescription: INodeProperties[] = [
    {
        ...getManyOptionsProperty,
        displayOptions: {
            show: showOnlyForUserGetMany,
        },
    }
];