import type { INodeProperties } from 'n8n-workflow';
// Import the shared properties
import {
    // limitProperty,
    // returnAllProperty,
    // filterProperty,
    // includeDeletedProperty,
    getManyOptionsProperty,
    splitOutputProperty
} from '../../shared/descriptions';

const showOnlyForUserGetMany = {
    operation: ['getAll'],
    resource: ['user'],
};

export const userGetManyDescription: INodeProperties[] = [
    // Spread the imported properties and add the displayOptions
    // {
    //     ...limitProperty,
    //     displayOptions: {
    //         show: {
    //             ...showOnlyForUserGetMany,
    //             returnAll: [false],
    //         },
    //     },
    // },
    // {
    //     ...returnAllProperty,
    //     displayOptions: {
    //         show: showOnlyForUserGetMany,
    //     },
    // },
    // {
    //     ...filterProperty,
    //     displayOptions: {
    //         show: showOnlyForUserGetMany,
    //     },
    // },
    // {
    //     ...includeDeletedProperty,
    //     displayOptions: {
    //         show: showOnlyForUserGetMany,
    //     },
    // },
    {
        ...splitOutputProperty,
        displayOptions: {
            show: showOnlyForUserGetMany,
        },
    },
    {
        ...getManyOptionsProperty,
        displayOptions: {
            show: showOnlyForUserGetMany,
        },
    }
];