// Scoro/resources/comment/getAll.ts

import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty } from '../../shared/descriptions';

const showOnlyForCommentGetMany = {
    operation: ['getAll'],
    resource: ['comment'],
};

export const commentGetManyDescription: INodeProperties[] = [
    {
        displayName: 'Module',
        name: 'module',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: showOnlyForCommentGetMany,
        },
        description: 'The module to which the comment belongs (e.g., tasks, projects)',
    },
    {
        displayName: 'Object ID',
        name: 'objectId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: showOnlyForCommentGetMany,
        },
        description: 'The ID of the object within the module',
    },
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForCommentGetMany },
    }
];