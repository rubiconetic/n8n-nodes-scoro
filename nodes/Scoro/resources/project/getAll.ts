import type { INodeProperties } from 'n8n-workflow';
import {
    getManyOptionsProperty,
    splitOutputProperty
} from '../../shared/descriptions';

const showOnlyForProjectGetMany = {
    operation: ['getAll'],
    resource: ['project'],
};

export const projectGetManyDescription: INodeProperties[] = [
    {
        ...splitOutputProperty,
        displayOptions: {
            show: showOnlyForProjectGetMany,
        },
    },
    {
        ...getManyOptionsProperty,
        displayOptions: {
            show: showOnlyForProjectGetMany,
        },
    }
];