// Scoro/resources/comment/create.ts

import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCommentCreate = {
    operation: ['create'],
    resource: ['comment'],
};

export const commentCreateDescription: INodeProperties[] = [
    {
        displayName: 'Module',
        name: 'module',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: showOnlyForCommentCreate,
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
            show: showOnlyForCommentCreate,
        },
        description: 'The ID of the object within the module',
    },
    {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        displayOptions: {
            show: showOnlyForCommentCreate,
        },
        description: 'The ID of the comment owner. Mandatory when using API Key authentication.',
    },
    {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'The content of the comment',
        displayOptions: {
            show: showOnlyForCommentCreate,
        },
    },
    {
        // Legacy 'request' property for backwards compatibility
        displayName: 'Request',
        name: 'request',
        type: 'json',
        displayOptions: {
            show: {
                // Hides this property from the UI
                resource: [],
            },
        },
        default: '',
    },
];