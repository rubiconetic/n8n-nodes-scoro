import type { INodeProperties } from 'n8n-workflow';
import {
    getManyOptionsProperty,
} from '../../shared/descriptions';

const showOnlyForProjectGetMany = {
    operation: ['getAll'],
    resource: ['project'],
};

export const projectGetManyDescription: INodeProperties[] = [
    {
        ...getManyOptionsProperty,
        displayOptions: {
            show: showOnlyForProjectGetMany,
        },
    }
];