import type { INodeProperties } from 'n8n-workflow';
import {
    getManyOptionsProperty,
    // splitOutputProperty
} from '../../shared/descriptions';

const showOnlyForUserGetMany = {
    operation: ['getAll'],
    resource: ['user'],
};

export const userGetManyDescription: INodeProperties[] = [
    // {
    //     ...splitOutputProperty,
    //     displayOptions: {
    //         show: showOnlyForUserGetMany,
    //     },
    // },
    {
        ...getManyOptionsProperty,
        displayOptions: {
            show: showOnlyForUserGetMany,
        },
    }
];